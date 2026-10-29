import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { groups, refs, seoField, str, txt, typed } from "../fields";

export const article = defineType({
	name: "article",
	title: "Članek",
	type: "document",
	icon: DocumentTextIcon,
	groups: groups(["content", "Vsebina"], ["meta", "Podatki"], ["seo", "SEO"]),
	fields: [
		str("title", "Naslov", { group: "content" }),
		defineField({
			name: "slug",
			title: "URL",
			type: "slug",
			group: "meta",
			options: { source: "title" },
			validation: (r) => r.required(),
		}),
		defineField({
			name: "category",
			title: "Kategorija",
			type: "reference",
			to: [{ type: "category" }],
			group: "meta",
			validation: (r) => r.required(),
		}),
		txt("excerpt", "Povzetek", {
			group: "content",
			description: "Ena do dve povedi. Prikazan na seznamu in v iskalnikih.",
		}),
		typed("cover", "Naslovna slika", "altImage", {
			group: "content",
			optional: true,
		}),
		typed("body", "Vsebina", "richText", { group: "content" }),
		defineField({
			name: "publishedAt",
			title: "Datum objave",
			type: "datetime",
			group: "meta",
			initialValue: () => new Date().toISOString(),
			validation: (r) => r.required(),
		}),
		defineField({
			name: "updatedAt",
			title: "Datum vsebinske posodobitve",
			type: "datetime",
			group: "meta",
			description:
				"Izpolni, ko članek vsebinsko posodobiš (ne za popravke tipkarskih napak).",
		}),
		defineField({
			name: "author",
			title: "Avtor",
			type: "reference",
			to: [{ type: "person" }],
			group: "meta",
			validation: (r) => r.required(),
		}),
		refs("related", "Sorodni članki", ["article"], {
			group: "meta",
			optional: true,
			description:
				"Do 3. Če je prazno, se samodejno izberejo članki iz iste kategorije.",
		}),
		seoField(),
	],
	orderings: [
		{
			title: "Najnovejši",
			name: "publishedAtDesc",
			by: [{ field: "publishedAt", direction: "desc" }],
		},
	],
	preview: {
		select: { title: "title", subtitle: "category.title", media: "cover" },
	},
});
