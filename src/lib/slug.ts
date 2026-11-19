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
