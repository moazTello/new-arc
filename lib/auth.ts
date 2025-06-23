import { Login } from "@/app/auth/validations";
import { db } from "@/db";
import type { Role } from "@/types";
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "./utils";

export type UserPublicData = {
	id: string;
	name: string;
	role: string;
};

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: UserPublicData & DefaultSession["user"];
	}
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	trustHost: process.env.TRUST_HOST === "true",
	useSecureCookies: process.env.SECURE_COOKIES !== "false",
	callbacks: {
		authorized: async ({ auth }) => {
			// Logged in users are authenticated, otherwise redirect to login page
			// console.log("auth", auth);
			return !!auth;
		},
		jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
		session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					...(token.user as UserPublicData),
				},
			};
		},
	},
	cookies: {
		sessionToken: {
			options: {
				// maxAge: 0

			},			
		},
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "credentials",

			async authorize(credentials, _req) {
				try {
					const { username, password } = Login.parse(credentials);
					const userWithPassword = await db.user.findFirst({
						where: {
							username,
						},
					});

					if (userWithPassword) {
						const isCorrect = await comparePassword(
							password,
							userWithPassword.passwordHash,
						);

						if (isCorrect)
							return {
								id: userWithPassword.id,
								name: userWithPassword.username,
								role: userWithPassword.role,
							};
					}
				} catch (error) {
					return null;
				}

				console.log("failed to authorize...");
				// If you return null then an error will be displayed advising the user to check their details.
				return null;
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
});

export const authorizeRoles = async (roles: Role[]) => {
	const session = await auth();
	const index = roles.findIndex((role) => role === session?.user.role);

	return index >= 0;
};
