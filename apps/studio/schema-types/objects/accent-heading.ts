import { StarIcon } from "@sanity/icons";
import { defineArrayMember, defineType } from "sanity";

/** A heading where single words can be highlighted in gold; each block is one line. */
export const accentHeading = defineType({
	name: "accentHeading",
	title: "Naslov s poudarkom",
	type: "array",
	description:
		"Označi besedo in klikni zvezdico za zlati poudarek. Vsaka vrstica (Enter) je nova vrstica naslova.",
	of: [
		defineArrayMember({
			type: "block",
			styles: [{ title: "Navadno", value: "normal" }],
			lists: [],
			marks: {
				decorators: [
					{ title: "Zlati poudarek", value: "accent", icon: StarIcon },
				],
				annotations: [],
			},
		}),
	],
	validation: (r) => r.required().min(1),
});
