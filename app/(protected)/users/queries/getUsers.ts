import { type Prisma, db } from "@/db";
import { authorizeRoles } from "@/lib/auth";
import { redirect } from "next/navigation";

interface GetUsersInput
	extends Pick<
		Prisma.UserFindManyArgs,
		"where" | "orderBy" | "skip" | "take"
	> {}

export default async ({
	where,
	orderBy,
	skip = 0,
	take = 100,
}: GetUsersInput) => {
	const isAuthorized = await authorizeRoles(["ADMIN"]);

	if (!isAuthorized) {
		redirect("/auht/login");
	}

	const count = await db.user.count({
		where,
	});

	const users = await db.user.findMany({
		skip,
		take,
		orderBy,
		where,
	});

	return {
		users,
		count,
	};
};
