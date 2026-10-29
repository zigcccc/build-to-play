import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { groups, list, section, str, txt, typed } from "../fields";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Nastavitve strani",
	type: "document",
	icon: CogIcon,
	groups: groups(
		["brand", "Blagovna znamka"],
		["contact", "Kontakt"],
		["business", "Podjetje"],
		["variables", "Spremenljivke"],
		["seo", "SEO"],
	),
	fields: [
		str("siteName", "Ime strani", { group: "brand" }),
		str("tagline", "Slogan", { group: "brand" }),
		txt("description", "Opis dejavnosti", {
			group: "brand",
			description:
				"2–3 povedi: kdo si, kaj ponujaš, kje. Uporablja se za iskalnike, AI asistente (llms.txt) in kot privzeti opis.",
		}),
		defineField({
			name: "trainer",
			title: "Trener",
			type: "reference",
			to: [{ type: "person" }],
			group: "brand",
			validation: (r) => r.required(),
		}),
		section(
			"phone",
			"Telefon",
			[
				str("display", "Prikaz", { description: "Npr. 041 123 456" }),
				str("e164", "Za klic", {
					description: "Mednarodni zapis brez presledkov, npr. +38641123456",
				}),
			],
			{ group: "contact" },
		),
		str("email", "E-pošta", { group: "contact" }),
		list("socials", "Družbena omrežja", "socialLink", { group: "contact" }),
		list("openingHours", "Delovni čas (treningi po dogovoru)", "labeledValue", {
			group: "contact",
		}),
		str("notificationEmail", "E-pošta za obvestila o povpraševanjih", {
			group: "contact",
			description:
				"Na ta naslov prejmeš vsa povpraševanja s strani. Ni prikazan na strani.",
		}),
		str("companyName", "Naziv podjetja", { group: "business" }),
		str("companyAddress", "Naslov podjetja", {
			group: "business",
			optional: true,
		}),
		str("vatId", "Davčna številka", { group: "business", optional: true }),
		str("registrationNumber", "Matična številka", {
			group: "business",
			optional: true,
		}),
		str("areaServed", "Območje delovanja", {
			group: "business",
			description: "Npr. Ljubljana z okolico in online po Sloveniji.",
		}),
		str("priceRange", "Cenovni razred", {
			group: "business",
			optional: true,
			description: "Za Google, npr. €€",
		}),
		str("responseTime", "{rok} – odzivni čas", {
			group: "variables",
			description: "Npr. 24 urah. Uporabi se povsod, kjer je v besedilu {rok}.",
		}),
		str("consultationDuration", "{trajanje} – trajanje posveta", {
			group: "variables",
			description: "Npr. 30 minut",
		}),
		str("testInterval", "{interval} – razmik med testiranji", {
			group: "variables",
			description: "Npr. 6 (tednov)",
		}),
		typed("seo", "Privzeti SEO", "seo", { group: "seo" }),
	],
	preview: { prepare: () => ({ title: "Nastavitve strani" }) },
});
