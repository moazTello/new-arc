import { auth } from "@/lib/auth";
import React from "react";
import styles from "../../styles/Settings.module.css";
import Exports from "./components/Exports";
import { ChangePasswordForm } from "./components/changePasswordForm";

const SettingsPage = async () => {
	const session = await auth();

	return (
		<main className={styles.main}>
			<ChangePasswordForm
				username={session?.user.name}
				userRole={session?.user.role}
			/>
			{session?.user.role === "ADMIN" && <Exports />}
		</main>
	);
};

export default SettingsPage;
