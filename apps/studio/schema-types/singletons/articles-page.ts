import { DocumentsIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { groups, section, seoField, str, txt } from "../fields";

export const articlesPage = defineType({
	name: "articlesPage",
	title: "Nasveti",
	type: "document",
	icon: DocumentsIcon,
	groups: groups(["list", "Seznam"], ["article", "Članek"], ["seo", "SEO"]),
	fields: [
		section(
			"hero",
			"Uvod",
			[
				str("eyebrow", "Nadnaslov"),
				str("heading", "Naslov"),
				txt("lead", "Uvod"),
			],
			{ group: "list" },
		),
		section(
			"list",
			"Seznam člankov",
			[
				str("allLabel", "Filter »vse«"),
				str("featuredLabel", "Oznaka izpostavljenega članka"),
				str("readingTime", "Čas branja", { description: "Npr. »min branja«" }),
				str("readingTimeShort", "Čas branja – kratko", {
					description: "Npr. »min«",
				}),
				str("loadMore", "Gumb za več člankov"),
				str("emptyText", "Ni člankov"),
				str("emptyCta", "Gumb pri praznem seznamu"),
			],
			{ group: "list" },
		),
		section(
			"article",
			"Stran članka",
			[
				str("tocLabel", "Kazalo"),
				str("shareLabel", "Deli"),
				str("copyLink", "Kopiraj povezavo"),
				str("copied", "Kopirano"),
				str("authorLabel", "Avtor"),
				str("authorLink", "Povezava na O meni"),
				str("updatedLabel", "Posodobljeno"),
				str("relatedHeading", "Sorodni članki – naslov"),
				str("allArticles", "Povezava na vse nasvete"),
			],
			{ group: "article" },
		),
		seoField(),
	],
	preview: { prepare: () => ({ title: "Nasveti" }) },
});
