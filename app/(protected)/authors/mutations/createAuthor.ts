"use server";

import { db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CreateAuthorSchema } from "../schemas";

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { RcFile } from "antd/es/upload";

type CreateAuthorProps = z.infer<typeof CreateAuthorSchema>;

export default async (data: CreateAuthorProps) => {
	try {
		const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR"]);

		if (!isAuthorized) {
			redirect("/auth/login");
		}

		const {
			prefix,
			firstName,
			middleName,
			lastName,
			overview,
			deathDate,
			birthDate,
			photo,
		} = CreateAuthorSchema.parse(data);

		let imageUrl: string | null = null;

		if (photo) {
			const file = photo as RcFile;

			const buffer = await file.arrayBuffer();
			const filename = `${randomUUID()}.${file.type.split("/")[1]}`;
			const uploadDir = path.join(process.cwd(), "blob", "authors");

			try {
				await fs.mkdir(uploadDir, { recursive: true });
			} catch (error) {
				console.error("Error creating directory:", error);
			}

			const filePath = path.join(uploadDir, filename);
			await fs.writeFile(filePath, Buffer.from(buffer));
			imageUrl = `/blob/authors/${filename}`;
		}

		const res = await db.author.create({
			data: {
				prefix,
				firstName,
				middleName,
				lastName,
				overview,
				birthDate,
				deathDate,
				photoUrl: imageUrl,
			},
		});

		revalidatePath("/authors");
		return { res };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("Unique constraint failed on the fields: `name`");
			}
		}

		if (error instanceof z.ZodError) {
			return { error };
		}

		console.log(error);
		return {
			error: "Unexpected error!",
		};
	}
};
