import { BlockquoteIcon, BulbOutlineIcon, HashIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const linkAnnotation = defineArrayMember({
	name: "link",
	type: "inlineLink",
	title: "Povezava",
});

/** Paragraphs, bold and links only – FAQ answers, short leads, consent labels. */
export const simpleText = defineType({
	name: "simpleText",
	title: "Besedilo",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [{ title: "Navadno", value: "normal" }],
			lists: [{ title: "Alineje", value: "bullet" }],
			marks: {
				decorators: [{ title: "Krepko", value: "strong" }],
				annotations: [linkAnnotation],
			},
		}),
	],
});

/** H2 headings are a dedicated block so editors control the ToC label and anchor. */
export const sectionHeading = defineType({
	name: "sectionHeading",
	title: "Podnaslov (H2)",
	type: "object",
	icon: HashIcon,
	fields: [
		defineField({
			name: "title",
			title: "Podnaslov",
			type: "string",
			description:
				"Najbolje kot vprašanje ali jasna trditev – tako ga AI asistenti lažje citirajo.",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "tocLabel",
			title: "Krajše ime v kazalu",
			type: "string",
			description: "Neobvezno. Če je prazno, se v kazalu uporabi podnaslov.",
		}),
		defineField({
			name: "anchor",
			title: "Sidro",
			type: "slug",
			options: {
				source: (_doc, ctx) => (ctx.parent as { title?: string })?.title ?? "",
			},
			validation: (r) => r.required(),
		}),
	],
	preview: {
		select: { title: "title" },
		prepare: ({ title }) => ({ title, subtitle: "H2" }),
	},
});

export const ctaBlock = defineType({
	name: "ctaBlock",
	title: "Poziv k posvetu",
	type: "object",
	icon: BulbOutlineIcon,
	fields: [
		defineField({
			name: "eyebrow",
			title: "Nadnaslov",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "text",
			title: "Besedilo",
			type: "string",
			validation: (r) => r.required(),
		}),
		defineField({
			name: "buttonLabel",
			title: "Gumb",
			type: "string",
			validation: (r) => r.required(),
		}),
	],
	preview: {
		select: { title: "text" },
		prepare: ({ title }) => ({ title, subtitle: "Poziv k posvetu" }),
	},
});

const bodyBlock = defineArrayMember({
	type: "block",
	styles: [
		{ title: "Navadno", value: "normal" },
		{ title: "Uvodni odstavek", value: "lead" },
		{ title: "Podnaslov H3", value: "h3" },
		{ title: "Citat", value: "blockquote", icon: BlockquoteIcon },
	],
	lists: [
		{ title: "Alineje", value: "bullet" },
		{ title: "Oštevilčeno", value: "number" },
	],
	marks: {
		decorators: [
			{ title: "Krepko", value: "strong" },
			{ title: "Ležeče", value: "em" },
		],
		annotations: [linkAnnotation],
	},
});

export const richText = defineType({
	name: "richText",
	title: "Vsebina",
	type: "array",
	of: [
		bodyBlock,
		defineArrayMember({ type: "sectionHeading" }),
		defineArrayMember({ type: "captionedImage" }),
		defineArrayMember({ type: "ctaBlock" }),
	],
});

export const legalText = defineType({
	name: "legalText",
	title: "Pravno besedilo",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				{ title: "Navadno", value: "normal" },
				{ title: "Podnaslov H3", value: "h3" },
			],
			lists: [
				{ title: "Alineje", value: "bullet" },
				{ title: "Oštevilčeno", value: "number" },
			],
			marks: {
				decorators: [
					{ title: "Krepko", value: "strong" },
					{ title: "Ležeče", value: "em" },
				],
				annotations: [linkAnnotation],
			},
		}),
		defineArrayMember({ type: "table" }),
	],
});
