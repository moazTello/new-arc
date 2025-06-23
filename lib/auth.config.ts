import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserPublicData } from "./auth";

// Notice this is only an object, not a full Auth.js instance
export default {
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
		// CredentialsProvider({
		// 	// The name to display on the sign in form (e.g. "Sign in with...")
		// 	name: "credentials",
		// 	// `credentials` is used to generate a form on the sign in page.
		// 	// You can specify which fields should be submitted, by adding keys to the `credentials` object.
		// 	// e.g. domain, username, password, 2FA token, etc.
		// 	// You can pass any HTML attribute to the <input> tag through the object.
		// 	credentials: {
		// 		username: { label: "Username", type: "text" },
		// 		password: { label: "Password", type: "password" },
		// 	},
		// }),
	],
	pages: {
		signIn: "/auth/login",
	},
} satisfies NextAuthConfig;
