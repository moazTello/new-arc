"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async (data: { id: number }) => {
	const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR"]);

	if (!isAuthorized) {
		redirect("/auth/login");
	}

	const { id } = z.object({ id: z.number() }).parse(data);

	try {
		// Get the author to retrieve the photoUrl
		const author = await db.author.findUnique({ where: { id } });

		// Delete the author
		const authors = await db.author.deleteMany({ where: { id } });

		// Delete the image file if it exists
		if (author?.photoUrl) {
			const filename = author.photoUrl.split("/").pop();
			if (filename) {
				const filePath = path.join(
					process.cwd(),
					"blob",
					"authors",
					filename,
				);
				try {
					await fs.unlink(filePath);
				} catch (error: any) {
					console.error("Error deleting old image:", error);
					// Don't throw an error if the file doesn't exist
					if (error.code !== "ENOENT") {
						throw error;
					}
				}
			}
		}

		revalidatePath("/authors");
		return authors.count;
	} catch (error) {
		console.error("Error deleting author:", error);
		throw error;
	}
};
