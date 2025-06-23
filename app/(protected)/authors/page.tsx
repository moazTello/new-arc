import { authorizeRoles } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { Result } from "antd";
import Title from "antd/es/typography/Title";
import type { SearchParams } from "nuqs";
import styles from "../../styles/Users.module.css";
import AuthorsList from "./components/AuthorList";
import NewAuthorForm from "./components/NewAuthorForm";
import SearchAuthor from "./components/SearchAuthor";
import getAuthors from "./queries/getAuthors";
import { loadSearchParams } from "./searchParams";

type PageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Users({ searchParams }: PageProps) {
	const isAllowed = await authorizeRoles(["ADMIN", "EDITOR"]);

	if (!isAllowed) {
		return <Result status="error" title="Not Authorized" />;
	}

	const { page, q } = await loadSearchParams(searchParams);
	const authorSearchText = q ?? undefined;
	let where: Prisma.AuthorWhereInput | undefined;
	if (authorSearchText) {
		where = {
			OR: [
				{ prefix: { contains: authorSearchText } },
				{ firstName: { contains: authorSearchText } },
				{ middleName: { contains: authorSearchText } },
				{ lastName: { contains: authorSearchText } },
			],
		};
	}

	const pageSize = 10;
	const data = await getAuthors({
		skip: (page - 1) * pageSize,
		take: pageSize,
		where,
		orderBy: {
			id: "desc",
		},
	});

	return (
		<main className={styles.main}>
			<div className={styles.formContainer}>
				<Title level={2} style={{ marginLeft: "5rem" }}>
					أضف مؤلف
				</Title>
				<NewAuthorForm />
			</div>
			<div className={styles.listContainer}>
				<SearchAuthor />
				<AuthorsList authors={data.authors} count={data.count} />
			</div>
		</main>
	);
}
