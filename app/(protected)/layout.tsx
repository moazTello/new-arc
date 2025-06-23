import { auth } from "@/lib/auth";
import Header from "../components/Header";
import styles from "../styles/Dashboard.module.css";

export default async function AuthLayout({
	children,
}: { children: React.ReactNode }) {
	const session = await auth();
	const role = session?.user.role || "USER";
	return (
		<>
			<Header role={role} />
			{children}
			<footer>
				{/* <span>Developed by</span>
        <span className={styles.textLink}>Smart IT Solutions</span> */}
			</footer>
		</>
	);
}
