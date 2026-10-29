import {
	defineArrayMember,
	defineField,
	type FieldDefinition,
	type FieldGroupDefinition,
} from "sanity";

type FieldOptions = {
	description?: string;
	group?: string;
	optional?: boolean;
	initialValue?: unknown;
};

const required = (o: FieldOptions) =>
	o.optional ? undefined : (r: { required: () => unknown }) => r.required();

export const str = (name: string, title: string, o: FieldOptions = {}) =>
	defineField({
		name,
		title,
		type: "string",
		description: o.description,
		group: o.group,
		initialValue: o.initialValue as string | undefined,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const txt = (name: string, title: string, o: FieldOptions = {}) =>
	defineField({
		name,
		title,
		type: "text",
		rows: 3,
		description: o.description,
		group: o.group,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const strList = (name: string, title: string, o: FieldOptions = {}) =>
	defineField({
		name,
		title,
		type: "array",
		of: [defineArrayMember({ type: "string" })],
		description: o.description,
		group: o.group,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const typed = (
	name: string,
	title: string,
	type: string,
	o: FieldOptions = {},
) =>
	defineField({
		name,
		title,
		type,
		description: o.description,
		group: o.group,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const list = (
	name: string,
	title: string,
	type: string,
	o: FieldOptions = {},
) =>
	defineField({
		name,
		title,
		type: "array",
		of: [defineArrayMember({ type })],
		description: o.description,
		group: o.group,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const refs = (
	name: string,
	title: string,
	to: string[],
	o: FieldOptions = {},
) =>
	defineField({
		name,
		title,
		type: "array",
		of: [
			defineArrayMember({
				type: "reference",
				to: to.map((type) => ({ type })),
			}),
		],
		description: o.description,
		group: o.group,
		// biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
		validation: required(o) as any,
	});

export const section = (
	name: string,
	title: string,
	fields: FieldDefinition[],
	o: FieldOptions = {},
) =>
	defineField({
		name,
		title,
		type: "object",
		fields,
		description: o.description,
		group: o.group,
		options: { collapsible: true, collapsed: false },
	});

/** Every singleton page gets a trailing SEO group. */
export const seoField = (group = "seo") =>
	defineField({ name: "seo", title: "SEO", type: "seo", group });

export const groups = (
	...items: [name: string, title: string][]
): FieldGroupDefinition[] =>
	items.map(([name, title], i) => ({ name, title, default: i === 0 }));

export const VARIABLES_HINT =
	"Lahko uporabiš spremenljivke {rok}, {trajanje}, {interval}, {email}, {telefon} – vrednosti se vzamejo iz Nastavitev strani.";
