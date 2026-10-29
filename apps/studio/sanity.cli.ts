import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: { projectId: "qhuqrj1j", dataset: "production" },
	studioHost: "build2play",
	deployment: { autoUpdates: true },
});
