import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, it } from 'vitest';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { getBytes, ref, uploadBytes } from 'firebase/storage';

let env: RulesTestEnvironment;
const bytes = new Uint8Array([1, 2, 3]);
const jpg = { contentType: 'image/jpeg' };
const pdf = { contentType: 'application/pdf' };

beforeAll(async () => {
	env = await initializeTestEnvironment({
		projectId: 'demo-goqr',
		storage: { rules: readFileSync('storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
	});
	await env.clearStorage();
	await env.withSecurityRulesDisabled(async (ctx) => {
		const s = ctx.storage();
		await uploadBytes(ref(s, 'foto-vieja.jpg'), bytes, jpg);
		await uploadBytes(ref(s, 'proofs/A/c.pdf'), bytes, pdf);
	});
});

afterAll(async () => {
	await env.cleanup();
});

const userA = () => env.authenticatedContext('A').storage();

describe('storage', () => {
	it('anónimo lee imagen vieja en la raíz (Foco 3)', async () => {
		await assertSucceeds(getBytes(ref(env.unauthenticatedContext().storage(), 'foto-vieja.jpg')));
	});

	it('A sube imagen a uploads/A', async () => {
		await assertSucceeds(uploadBytes(ref(userA(), 'uploads/A/x.jpg'), bytes, jpg));
	});

	it('A no sube a uploads/B', async () => {
		await assertFails(uploadBytes(ref(userA(), 'uploads/B/x.jpg'), bytes, jpg));
	});

	it('A no sube PDF a uploads/A', async () => {
		await assertFails(uploadBytes(ref(userA(), 'uploads/A/x.pdf'), bytes, pdf));
	});

	it('A no sube a la raíz', async () => {
		await assertFails(uploadBytes(ref(userA(), 'x.jpg'), bytes, jpg));
	});

	it('A no sube a optimized/', async () => {
		await assertFails(uploadBytes(ref(userA(), 'optimized/x.jpg'), bytes, jpg));
	});

	it('anónimo no lee proofs/A/c.pdf', async () => {
		await assertFails(getBytes(ref(env.unauthenticatedContext().storage(), 'proofs/A/c.pdf')));
	});

	it('A lee y sube su comprobante PDF; B no lo lee; admin sí', async () => {
		await assertSucceeds(getBytes(ref(userA(), 'proofs/A/c.pdf')));
		await assertSucceeds(uploadBytes(ref(userA(), 'proofs/A/d.pdf'), bytes, pdf));
		await assertFails(getBytes(ref(env.authenticatedContext('B').storage(), 'proofs/A/c.pdf')));
		await assertSucceeds(getBytes(ref(env.authenticatedContext('admin', { admin: true }).storage(), 'proofs/A/c.pdf')));
	});
});
