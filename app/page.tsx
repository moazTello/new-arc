import { authorizeRoles } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
	const isAuthenticated = await authorizeRoles(["ADMIN", "EDITOR", "USER"]);
	if (isAuthenticated) {
		redirect("/books");
	} else {
		redirect("/auth/login");
	}
	return <div />;
}
