import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

let env: RulesTestEnvironment;

beforeAll(async () => {
	env = await initializeTestEnvironment({
		projectId: 'demo-goqr',
		firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
	});
});

afterAll(async () => {
	await env.cleanup();
});

beforeEach(async () => {
	await env.clearFirestore();
	await env.withSecurityRulesDisabled(async (ctx) => {
		const db = ctx.firestore();
		await setDoc(doc(db, 'establishments/est1'), { userId: 'owner', name: 'Local', isActive: true });
		await setDoc(doc(db, 'establishments/est1/categories/cat1'), { es_name: 'Bebidas', en_name: 'Drinks' });
		await setDoc(doc(db, 'establishments/est1/categories/cat1/subcategories/sub1'), { es_name: 'Frías', en_name: 'Cold' });
		await setDoc(doc(db, 'products/p1'), { establishmentId: 'est1', es_name: 'Café', deletedAt: null });
		await setDoc(doc(db, 'establishments/est2'), { userId: 'other', name: 'Otro' });
	});
});

const owner = () => env.authenticatedContext('owner').firestore();
const other = () => env.authenticatedContext('other').firestore();

describe('products', () => {
	it('dueño crea producto en su establecimiento', async () => {
		await assertSucceeds(setDoc(doc(owner(), 'products/p2'), { establishmentId: 'est1', es_name: 'Té' }));
	});

	it('dueño hace soft-delete de su producto', async () => {
		await assertSucceeds(updateDoc(doc(owner(), 'products/p1'), { deletedAt: new Date() }));
	});

	it('otro usuario no crea producto en establecimiento ajeno', async () => {
		await assertFails(setDoc(doc(other(), 'products/p2'), { establishmentId: 'est1', es_name: 'Té' }));
	});

	it('otro usuario no edita producto ajeno', async () => {
		await assertFails(updateDoc(doc(other(), 'products/p1'), { es_name: 'Hackeado' }));
	});

	it('dueño no mueve un producto a otro establecimiento', async () => {
		await assertFails(updateDoc(doc(owner(), 'products/p1'), { establishmentId: 'est2' }));
	});
});

describe('categories y subcategories', () => {
	it('dueño escribe su categoría', async () => {
		await assertSucceeds(setDoc(doc(owner(), 'establishments/est1/categories/cat2'), { es_name: 'Postres' }));
	});

	it('otro usuario no escribe categoría ajena', async () => {
		await assertFails(setDoc(doc(other(), 'establishments/est1/categories/cat2'), { es_name: 'X' }));
	});

	it('otro usuario no escribe subcategoría ajena', async () => {
		await assertFails(setDoc(doc(other(), 'establishments/est1/categories/cat1/subcategories/sub2'), { es_name: 'X' }));
	});
});

describe('establishments', () => {
	it('dueño no cambia isActive', async () => {
		await assertFails(updateDoc(doc(owner(), 'establishments/est1'), { isActive: false }));
	});

	it('dueño no cambia billing', async () => {
		await assertFails(updateDoc(doc(owner(), 'establishments/est1'), { billing: { plan: 'pro' } }));
	});

	it('dueño cambia el nombre', async () => {
		await assertSucceeds(updateDoc(doc(owner(), 'establishments/est1'), { name: 'X' }));
	});

	it('otro usuario no edita establecimiento ajeno', async () => {
		await assertFails(updateDoc(doc(other(), 'establishments/est1'), { name: 'X' }));
	});

	it('crear establecimiento con isActive falla', async () => {
		await assertFails(setDoc(doc(owner(), 'establishments/est3'), { userId: 'owner', name: 'N', isActive: true }));
	});

	it('crear establecimiento propio sin campos de servidor funciona', async () => {
		await assertSucceeds(setDoc(doc(owner(), 'establishments/est3'), { userId: 'owner', name: 'N' }));
	});

	it('crear establecimiento a nombre de otro falla', async () => {
		await assertFails(setDoc(doc(owner(), 'establishments/est3'), { userId: 'other', name: 'N' }));
	});
});

describe('migrated-users (Foco 1)', () => {
	const ana = () => env.authenticatedContext('ana', { email: 'Ana@Correo.com' }).firestore();

	it('correo con mayúsculas escribe su doc en minúsculas', async () => {
		await assertSucceeds(setDoc(doc(ana(), 'migrated-users/ana@correo.com'), { migratedAt: 'x' }));
	});

	it('no escribe el doc de otro correo', async () => {
		await assertFails(setDoc(doc(ana(), 'migrated-users/otro@correo.com'), { migratedAt: 'x' }));
	});

	it('no borra su propio marker', async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'migrated-users/ana@correo.com'), { migratedAt: 'x' });
		});
		await assertFails(deleteDoc(doc(ana(), 'migrated-users/ana@correo.com')));
	});

	it('actualiza su propio marker', async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'migrated-users/ana@correo.com'), { migratedAt: 'x' });
		});
		await assertSucceeds(setDoc(doc(ana(), 'migrated-users/ana@correo.com'), { migratedAt: 'y' }));
	});

	it('anónimo lee migrated-users (login lo consulta antes de autenticarse)', async () => {
		await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'migrated-users/ana@correo.com')));
	});
});

describe('users', () => {
	it('usuario lee su doc y no el ajeno, y no escribe', async () => {
		await assertSucceeds(getDoc(doc(owner(), 'users/owner')));
		await assertFails(getDoc(doc(owner(), 'users/other')));
		await assertFails(setDoc(doc(owner(), 'users/owner'), { a: 1 }));
	});
});

describe('lectura pública', () => {
	it('anónimo lee products/x y establishments/x', async () => {
		const db = env.unauthenticatedContext().firestore();
		await assertSucceeds(getDoc(doc(db, 'products/x')));
		await assertSucceeds(getDoc(doc(db, 'establishments/x')));
	});

	it('anónimo no escribe colecciones no listadas', async () => {
		await assertFails(setDoc(doc(owner(), 'bills/b1'), { userId: 'owner' }));
	});
});

describe('transfers y stripe-events', () => {
	const base = {
		establishmentId: 'est1',
		userId: 'owner',
		plan: 'monthly',
		amount: 300,
		currency: 'DOP',
		status: 'pending',
	};
	const anon = () => env.unauthenticatedContext().firestore();

	beforeEach(async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'transfers/t1'), base);
			await setDoc(doc(ctx.firestore(), 'stripe-events/e1'), { type: 'x' });
		});
	});

	it('dueño crea transferencia pendiente de su establecimiento', async () => {
		await assertSucceeds(setDoc(doc(owner(), 'transfers/t2'), base));
	});

	it('no crea con status approved', async () => {
		await assertFails(setDoc(doc(owner(), 'transfers/t2'), { ...base, status: 'approved' }));
	});

	it('no crea para establecimiento ajeno', async () => {
		await assertFails(setDoc(doc(owner(), 'transfers/t2'), { ...base, establishmentId: 'est2' }));
	});

	it('no crea con reviewedBy', async () => {
		await assertFails(setDoc(doc(owner(), 'transfers/t2'), { ...base, reviewedBy: 'owner' }));
	});

	it('dueño lee la suya; otro usuario y anónimo no', async () => {
		await assertSucceeds(getDoc(doc(owner(), 'transfers/t1')));
		await assertFails(getDoc(doc(other(), 'transfers/t1')));
		await assertFails(getDoc(doc(anon(), 'transfers/t1')));
	});

	it('nadie actualiza ni borra', async () => {
		await assertFails(updateDoc(doc(owner(), 'transfers/t1'), { status: 'approved' }));
		await assertFails(deleteDoc(doc(owner(), 'transfers/t1')));
	});

	it('stripe-events no se lee', async () => {
		await assertFails(getDoc(doc(owner(), 'stripe-events/e1')));
		await assertFails(getDoc(doc(anon(), 'stripe-events/e1')));
	});
});

describe('bills', () => {
	const anon = () => env.unauthenticatedContext().firestore();
	const admin = () => env.authenticatedContext('staff', { admin: true }).firestore();

	beforeEach(async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'bills/b1'), { userId: 'owner', amount: 300, hostedInvoiceUrl: 'https://h' });
		});
	});

	it('dueño lee la suya, también con la consulta por userId de la app', async () => {
		await assertSucceeds(getDoc(doc(owner(), 'bills/b1')));
		await assertSucceeds(getDocs(query(collection(owner(), 'bills'), where('userId', '==', 'owner'))));
	});

	it('otro usuario y anónimo no leen; nadie lista todo', async () => {
		await assertFails(getDoc(doc(other(), 'bills/b1')));
		await assertFails(getDoc(doc(anon(), 'bills/b1')));
		await assertFails(getDocs(collection(anon(), 'bills')));
		await assertFails(getDocs(collection(other(), 'bills')));
	});

	it('admin lee', async () => {
		await assertSucceeds(getDoc(doc(admin(), 'bills/b1')));
	});

	it('el cliente no escribe', async () => {
		await assertFails(setDoc(doc(owner(), 'bills/b2'), { userId: 'owner' }));
		await assertFails(updateDoc(doc(owner(), 'bills/b1'), { amount: 1 }));
		await assertFails(deleteDoc(doc(owner(), 'bills/b1')));
	});
});

describe('mail-throttle', () => {
	const anon = () => env.unauthenticatedContext().firestore();

	beforeEach(async () => {
		await env.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'mail-throttle/x'), { at: 1 });
		});
	});

	it('ni usuario ni anónimo leen', async () => {
		await assertFails(getDoc(doc(owner(), 'mail-throttle/x')));
		await assertFails(getDoc(doc(anon(), 'mail-throttle/x')));
	});

	it('ni usuario ni anónimo escriben', async () => {
		await assertFails(setDoc(doc(owner(), 'mail-throttle/x'), { at: 2 }));
		await assertFails(setDoc(doc(anon(), 'mail-throttle/x'), { at: 2 }));
	});
});
