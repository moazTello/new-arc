import { authorizeRoles } from "@/lib/auth";
import { Result } from "antd";
import Title from "antd/es/typography/Title";
import type { SearchParams } from "nuqs";
import styles from "../../styles/Users.module.css";
import NewUserForm from "./components/NewUserForm";
import UserList from "./components/UserList";
import getUsers from "./queries/getUsers";
import { loadSearchParams } from "./searchParams";

type PageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Users({ searchParams }: PageProps) {
	const isAuthorized = await authorizeRoles(["ADMIN"]);

	if (!isAuthorized) {
		return <Result status="error" title="Not Authorized" />;
	}

	const { page } = await loadSearchParams(searchParams);
	const pageSize = 10;
	const data = await getUsers({
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	return (
		<main className={styles.main}>
			<div className={styles.formContainer}>
				<Title level={2} style={{ marginLeft: "5rem" }}>
					أضف مستخدم
				</Title>
				<NewUserForm />
			</div>
			<div className={styles.listContainer}>
				<UserList users={data.users} count={data.count} />
			</div>
		</main>
	);
}
