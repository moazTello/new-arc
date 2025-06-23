import { auth } from "@/lib/auth";
import type { Book } from "@prisma/client";
import Title from "antd/es/typography/Title";
import type { SearchParams } from "nuqs";
import styles from "../../styles/Dashboard.module.css";
import BooksTable from "./components/BooksTable";
import NewBookForm from "./components/NewBookForm";
import getBooks from "./queries/getBooks";
import { loadSearchParams } from "./searchParams";

type PageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function BooksPage({ searchParams }: PageProps) {
	const session = await auth();
	let { q, value, orderBy, orderDir, page, pageSize } =
		await loadSearchParams(searchParams);
	page = page && page > 1 ? page : 1;
	pageSize = pageSize && pageSize > 0 ? pageSize : 10;
	const { books, count } = await getBooks({
		skip: (page - 1) * pageSize,
		take: pageSize,
		where: {
			...(q && q !== "Author"
				? { [q as keyof Book]: { contains: value } }
				: {}),
			...(q && value && q === "Author"
				? {
						Author: {
							OR: [
								{ prefix: { contains: value } },
								{ firstName: { contains: value } },
								{ middleName: { contains: value } },
								{ lastName: { contains: value } },
							],
						},
					}
				: {}),
		},
		orderBy: {
			...(orderBy && orderDir ? { [orderBy]: orderDir } : { id: "desc" }),
		},
	});

	const isAllowedToEdit = ["ADMIN", "EDITOR"].includes(
		session?.user.role || "no",
	);

	return (
		<main className={styles.main}>
			{isAllowedToEdit && (
				<div className={styles.formContainer}>
					<Title level={2} style={{ marginRight: "3rem" }}>
						أضف كتاب
					</Title>
					<NewBookForm />
				</div>
			)}
			<BooksTable data={books} count={count} isAdmin={isAllowedToEdit} />
		</main>
	);
}
