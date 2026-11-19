import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
