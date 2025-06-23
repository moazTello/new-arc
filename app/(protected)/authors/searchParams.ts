import { createLoader, parseAsFloat, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
	page: parseAsFloat.withDefault(1),
	q: parseAsString,
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
