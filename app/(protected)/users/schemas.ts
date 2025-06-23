import { z } from "zod";
import { email, password, role } from "../../auth/validations";

export const CreateUserSchema = z.object({
	email,
	password,
	role,
	// template: __fieldName__: z.__zodType__(),
});

export const DeleteUserSchema = z.object({
	id: z.string().cuid(),
});
