// import { auth } from '@/lib/auth';

// export default auth;

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
