"use server";

import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { generateBookCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { CreateBookSchema } from "../schemas";

export default async (input: z.infer<typeof CreateBookSchema>) => {
	const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR"]);

	if (!isAuthorized) {
		redirect("/auht/login");
	}

	const values = CreateBookSchema.parse(input);

	const book = await db.$transaction(async (prisma) => {
		const res = await prisma.book.create({
			data: {
				...values,
				code: randomUUID(),
			},
			include: {
				Author: true,
			},
		});

		if (!res.Author) throw new Error("Author for this book not found!");

		const { firstName, lastName } = res.Author;

		const updatedBook = await prisma.book.update({
			where: { id: res.id },
			data: {
				code: generateBookCode(
					res.Author.insertedBooksCount + 1,
					firstName,
					lastName,
					res.releaseDate,
				),
				Author: {
					update: {
						insertedBooksCount: res.Author.insertedBooksCount + 1,
					},
				},
			},
		});

		return updatedBook;
	});

	revalidatePath("/books");
	return book;
};
