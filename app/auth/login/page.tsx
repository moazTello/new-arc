import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { LoginForm } from "./components/LoginForm";

const LoginPage = async () => {
	const session = await auth();

	if (session?.user) {
		redirect("/");
	}

	return <LoginForm />;
};

export default LoginPage;
