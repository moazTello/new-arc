import { createLoader, parseAsFloat } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
	page: parseAsFloat.withDefault(1),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
