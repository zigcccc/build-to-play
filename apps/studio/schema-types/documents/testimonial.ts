import { CommentIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { str, txt } from "../fields";

export const testimonial = defineType({
	name: "testimonial",
	title: "Mnenje stranke",
	type: "document",
	icon: CommentIcon,
	fields: [
		txt("quote", "Mnenje"),
		str("name", "Ime", { description: "Npr. Ana K." }),
		str("program", "Program", { optional: true }),
		str("place", "Kraj", { optional: true }),
	],
	preview: { select: { title: "name", subtitle: "quote" } },
});
