import { documentTypes } from "./documents";
import { objectTypes } from "./objects";
import { singletonTypes } from "./singletons";

export const schemaTypes = [
	...singletonTypes,
	...documentTypes,
	...objectTypes,
];
