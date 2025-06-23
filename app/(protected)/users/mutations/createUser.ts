"use server";

import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { hashPassword } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreateUserSchema } from "../schemas";

type CreateUserProps = z.infer<typeof CreateUserSchema>;

export default async (data: CreateUserProps) => {
	try {
		const isAuthorized = await authorizeRoles(["ADMIN"]);

		if (!isAuthorized) {
			return {
				error: "Unauthorized",
			};
		}

		const { email, password, role } = CreateUserSchema.parse(data);
		const passwordHash = await hashPassword(password);
		const res = await db.user.create({
			data: {
				username: email,
				passwordHash,
				role,
			},
			select: {
				id: true,
				username: true,
				role: true,
			},
		});

		revalidatePath("/users");
		return res;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("Unique constraint failed on the fields: `username`");
			}
		}

		if (error instanceof z.ZodError) {
			return { error };
		}

		return {
			error: "Unknown Error!",
		};
	}
};
