import { type Prisma, db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { redirect } from "next/navigation";

interface GetAuthorInput
	extends Pick<
		Prisma.AuthorFindManyArgs,
		"where" | "orderBy" | "skip" | "take"
	> {}

export default async ({
	where,
	orderBy,
	skip = 0,
	take = 100,
}: GetAuthorInput) => {
	const isAuthorized = await authorizeRoles(["ADMIN", "EDITOR", "USER"]);

	if (!isAuthorized) {
		redirect("/auth/login");
	}

	const count = await db.author.count({
		where,
	});

	const authors = await db.author.findMany({
		skip,
		take,
		orderBy,
		where,
	});

	return {
		authors,
		// nextPage,
		// hasMore,
		count,
	};
};
