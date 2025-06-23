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

type UpdateAuthorProps = {
	id: number;
	prefix?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	overview: string;
	birthDate: string;
	deathDate?: string;
	photo?: RcFile | null | undefined;
};

export default async ({ id, photo, ...data }: UpdateAuthorProps) => {
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
		} = CreateAuthorSchema.parse(data);

		let imageUrl: string | null | undefined = undefined;

		if (photo === null) {
			// Delete old image
			const author = await db.author.findUnique({ where: { id } });
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
					} catch (error) {
						console.error("Error deleting old image:", error);
					}
				}
			}
			imageUrl = null;
		} else if (photo) {
			// Upload new image and delete old one
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

			// Delete old image
			const author = await db.author.findUnique({ where: { id } });
			if (author?.photoUrl) {
				const oldFilename = author.photoUrl.split("/").pop();
				if (oldFilename) {
					const oldFilePath = path.join(
						process.cwd(),
						"blob",
						"authors",
						oldFilename,
					);
					try {
						await fs.unlink(oldFilePath);
					} catch (error) {
						console.error("Error deleting old image:", error);
					}
				}
			}
		}

		const res = await db.author.update({
			where: {
				id,
			},
			data: {
				prefix,
				firstName,
				middleName,
				lastName,
				overview,
				birthDate,
				deathDate,
				photoUrl: imageUrl === undefined ? undefined : imageUrl,
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
