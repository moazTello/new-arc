import { db } from "@/db";
import { z } from "zod";

const GetProject = z.object({
	// This accepts type of undefined, but is required at runtime
	id: z.number().optional().refine(Boolean, "Required"),
});

export default async (values: { id: number }) => {
	const { id } = GetProject.parse(values);

	const book = await db.book.findFirst({ where: { id } });

	if (!book) throw new Error("Book not found");

	return book;
};
