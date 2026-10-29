import { UserIcon } from "@sanity/icons";
import { defineType } from "sanity";
import {
	groups,
	list,
	section,
	seoField,
	str,
	strList,
	txt,
	typed,
} from "../fields";

export const aboutPage = defineType({
	name: "aboutPage",
	title: "O meni",
	type: "document",
	icon: UserIcon,
	groups: groups(
		["hero", "Uvod"],
		["story", "Zgodba"],
		["approach", "Pristop"],
		["seo", "SEO"],
	),
	fields: [
		section(
			"hero",
			"Uvod",
			[
				str("eyebrow", "Nadnaslov"),
				str("heading", "Naslov"),
				txt("lead", "Uvod"),
				typed("primaryCta", "Glavni gumb", "link"),
				typed("secondaryCta", "Drugi gumb", "link", { optional: true }),
				typed("portrait", "Portret", "altImage", { optional: true }),
				list("stats", "Številke", "stat"),
			],
			{ group: "hero" },
		),
		section(
			"story",
			"Moja zgodba",
			[
				str("eyebrow", "Nadnaslov"),
				str("heading", "Naslov"),
				strList("paragraphs", "Odstavki", {
					description: "Prvi odstavek je poudarjen.",
				}),
				txt("quote", "Citat"),
			],
			{ group: "story" },
		),
		section(
			"approach",
			"Pristop",
			[
				str("eyebrow", "Nadnaslov"),
				str("heading", "Naslov"),
				list("items", "Načela", "titledText"),
			],
			{ group: "approach" },
		),
		section(
			"credentials",
			"Izobrazba in licence",
			[
				str("eyebrow", "Nadnaslov"),
				str("heading", "Naslov"),
				list("items", "Seznam", "credential"),
			],
			{ group: "approach" },
		),
		list("gallery", "Galerija", "altImage", {
			group: "approach",
			optional: true,
		}),
		typed("cta", "CTA kartica", "ctaCard", { group: "approach" }),
		seoField(),
	],
	preview: { prepare: () => ({ title: "O meni" }) },
});
