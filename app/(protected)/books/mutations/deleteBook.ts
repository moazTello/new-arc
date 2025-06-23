"use server";

import { db } from "@/db";
import { auth, authorizeRoles } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async ({ id }: { id: number }) => {
	const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR"]);

	if (!isAuthorized) {
		redirect("/auht/login");
	}

	const book = await db.book.deleteMany({ where: { id } });

	revalidatePath("/books");
	return book;
};
