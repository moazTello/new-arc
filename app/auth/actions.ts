"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const logout = async () => {
	const session = await auth();

	if (!session?.user?.name) {
		redirect("/auth/login");
	}

	await signOut();
};

function isRedirectError(error: Error & { digest?: string }) {
	return !!error.digest?.startsWith("NEXT_REDIRECT");
}

export const login = async (formData: FormData) => {
	try {
		await signIn("credentials", formData);
	} catch (error: any) {
		if (error instanceof AuthError) {
			return {
				error: "خطأ في البيانات المدخلة!",
			};
		}

		if (isRedirectError(error)) {
			throw error;
		}

		return {
			error: "Unkown error while loggin in",
		};
	}
};
