export function slugify(name: string): string {
	return name
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40)
		.replace(/-+$/, "");
}

export function isValidSlug(s: string): boolean {
	return s.length >= 3 && s.length <= 40 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
}

/** slugify para el campo manual: conserva el guion final mientras se escribe ("la roca " → "la-roca-"). */
export function slugifyInput(value: string): string {
	const slug = slugify(value);
	return slug && /[^\p{L}\p{M}\p{N}]$/u.test(value) ? `${slug}-` : slug;
}
