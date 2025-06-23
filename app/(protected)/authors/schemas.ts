import { z } from "zod";

export const CreateAuthorSchema = z
	.object({
		prefix: z.string().trim().optional().default(""),
		firstName: z.string().trim(),
		middleName: z.string().trim().optional().default(""),
		lastName: z.string().trim(),
		overview: z.string().trim().optional().default(""),
		birthDate: z.string().trim(),
		deathDate: z.string().trim().optional(),
		photo: z.any().nullable().optional(),
	})
	.strict();

export const UpdateAuthorSchema = z
	.object({
		id: z.coerce.number().int(),
		prefix: z.string().trim().optional().default(""),
		firstName: z.string().trim(),
		middleName: z.string().trim().optional().default(""),
		lastName: z.string().trim(),
		overview: z.string().trim().optional().default(""),
		birthDate: z.string().trim(),
		deathDate: z.string().trim().optional().nullable(),
		photoUrl: z.any().nullable().optional(),
	})
	.strict();
