"use server";

import { ChangePassword } from "@/app/auth/validations";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/utils";
import { AuthError } from "next-auth";
import { z } from "zod";

export const changePassword = async (values: {
	currentPassword: string;
	newPassword: string;
}) => {
	const session = await auth();
	if (!session?.user) {
		throw new AuthError("Must login first!");
	}
	const id = z.string().cuid().parse(session?.user.id);
	const { newPassword, currentPassword } = ChangePassword.parse(values);

	const userWithPassword = await db.user.findFirst({
		where: {
			id,
		},
	});

	if (!userWithPassword) {
		throw new Error("User not found!");
	}

	const isCorrect = await comparePassword(
		currentPassword,
		userWithPassword.passwordHash,
	);

	if (!isCorrect) {
		throw new Error("incorrect password!");
	}

	const passwordHash = await hashPassword(newPassword);

	await db.user.update({
		where: { id },
		data: {
			passwordHash,
		},
	});

	return true;
};
