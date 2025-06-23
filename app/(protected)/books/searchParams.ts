import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const booksSearchParams = {
	q: parseAsString,
	value: parseAsString,
	orderBy: parseAsString,
	orderDir: parseAsString,
	page: parseAsInteger,
	pageSize: parseAsInteger,
};

export const loadSearchParams = createLoader(booksSearchParams);
