"use server";

import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { DeleteUserSchema } from "../schemas";

export default async (data: { id: string }) => {
	const isAuthorized = await authorizeRoles(["ADMIN"]);

	if (!isAuthorized) {
		return {
			error: "Unauthorized!",
		};
	}

	const { id } = DeleteUserSchema.parse(data);
	const users = await db.user.deleteMany({ where: { id } });

	revalidatePath("/users");
	return users.count;
};
