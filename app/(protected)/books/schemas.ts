import { z } from "zod";

export const CreateBookSchema = z.object({
	// code: z.string().trim(),
	name: z.string().trim(),
	translator: z.string().trim().optional(),
	checker: z.string().trim().optional(),
	weight: z.string().trim(),
	length: z.string().trim(),
	width: z.string().trim(),
	height: z.string().trim(),
	printDate: z.string().datetime().trim(),
	releaseDate: z.string(),
	pagesCount: z.number().int().min(0),
	authorId: z.number(),
	bookUrl: z.string().url(),
});
export const UpdateBookSchema = CreateBookSchema.merge(
	z.object({
		id: z.number(),
	}),
);

export const DeleteBookSchema = z.object({
	id: z.number(),
});
