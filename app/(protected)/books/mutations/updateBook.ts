"use server";

import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import type { UpdateBookSchema } from "../schemas";

export default async ({ id, ...data }: z.infer<typeof UpdateBookSchema>) => {
	const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR"]);

	if (!isAuthorized) {
		redirect("/auht/login");
	}

	const book = await db.book.update({
		where: { id },
		data: {
			...data,
		},
	});

	revalidatePath("/books");
	return book;
};
