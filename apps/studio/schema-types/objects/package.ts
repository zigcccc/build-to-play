import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { str, strList } from "../fields";

export const pricePackage = defineType({
	name: "pricePackage",
	title: "Paket",
	type: "object",
	icon: PackageIcon,
	fields: [
		str("name", "Ime paketa"),
		defineField({
			name: "price",
			title: "Cena (€)",
			type: "number",
			description:
				"Številka brez znaka €. Uporablja se tudi za strukturirane podatke (Google).",
			validation: (r) => r.min(0),
		}),
		str("priceLabel", "Prikaz cene (neobvezno)", {
			optional: true,
			description:
				"Če je izpolnjeno, se prikaže namesto cene, npr. »Po dogovoru«.",
		}),
		str("unit", "Enota", {
			optional: true,
			description: "Npr. / trening, / mesec",
		}),
		str("note", "Opomba", { optional: true }),
		strList("features", "Kaj vključuje"),
		str("ctaLabel", "Besedilo gumba"),
		defineField({
			name: "featured",
			title: "Priporočen paket",
			type: "boolean",
			initialValue: false,
		}),
	],
	validation: (r) =>
		r.custom((value: { price?: number; priceLabel?: string } | undefined) =>
			value?.price === undefined && !value?.priceLabel
				? "Vpiši ceno ali prikaz cene."
				: true,
		),
	preview: {
		select: {
			title: "name",
			price: "price",
			label: "priceLabel",
			featured: "featured",
		},
		prepare: ({ title, price, label, featured }) => ({
			title: `${title}${featured ? " ★" : ""}`,
			subtitle: label ?? (price !== undefined ? `${price} €` : ""),
		}),
	},
});

export const resultMetric = defineType({
	name: "resultMetric",
	title: "Meritev",
	type: "object",
	fields: [
		str("label", "Meritev"),
		str("from", "Začetek"),
		str("to", "Po 12 tednih"),
		str("delta", "Sprememba", { description: "Npr. +42 %" }),
	],
	preview: { select: { title: "label", subtitle: "delta" } },
});

export const resultTab = defineType({
	name: "resultTab",
	title: "Zavihek rezultatov",
	type: "object",
	fields: [
		defineField({
			name: "program",
			title: "Program",
			type: "reference",
			to: [{ type: "program" }],
			validation: (r) => r.required(),
		}),
		defineField({
			name: "description",
			title: "Opis",
			type: "text",
			rows: 2,
			validation: (r) => r.required(),
		}),
		defineField({
			name: "points",
			title: "Točke grafa",
			type: "array",
			of: [{ type: "number" }],
			description: "8 vrednosti med 0 in 110 – oblika krivulje napredka.",
			validation: (r) => r.required().length(8),
		}),
		defineField({
			name: "metrics",
			title: "Meritve",
			type: "array",
			of: [{ type: "resultMetric" }],
			validation: (r) => r.required().min(1).max(4),
		}),
	],
	preview: { select: { title: "program.name" } },
});
