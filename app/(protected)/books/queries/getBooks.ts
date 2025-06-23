"use server";

import { type Prisma, db } from "@/db";

interface GetBooksInput extends Prisma.BookFindManyArgs {}

export default async ({
	where,
	include,
	skip = 0,
	take = 100,
	...props
}: GetBooksInput) => {
	const count = await db.book.count({ where });
	const books = await db.book.findMany({
		skip,
		take,
		where,
		...props,
		include: {
			Author: true,
			...include,
		},
	});

	return {
		books,
		count,
	};
};
