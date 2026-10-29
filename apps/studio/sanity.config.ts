import { privateType, singletonType } from "@b2p/shared";
import { table } from "@sanity/table";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./presentation";
import { schemaTypes } from "./schema-types";
import { structure } from "./structure";

const previewUrl =
	process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000";

export default defineConfig({
	name: "default",
	title: "Build 2 Play",
	projectId: "qhuqrj1j",
	dataset: "production",
	plugins: [
		structureTool({ structure }),
		presentationTool({
			resolve,
			previewUrl: {
				initial: previewUrl,
				previewMode: { enable: "/api/draft-mode/enable" },
			},
			allowOrigins: [previewUrl],
		}),
		table(),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		// Inquiries are created by the website only.
		templates: (prev) =>
			prev.filter(
				(t) => !privateType.options.includes(t.schemaType as "inquiry"),
			),
	},
	document: {
		singletons: singletonType.options,
		actions: (prev, context) =>
			context.singleton
				? prev.filter((a) => a.action !== "delete")
				: context.schemaType === "inquiry"
					? prev.filter((a) => a.action !== "duplicate")
					: prev,
	},
});
