"use server";

import getAuthors from "../../authors/queries/getAuthors";

export const searchAuthors = async (value: string) => {
	const { authors } = await getAuthors({
		where: {
			OR: [
				{ firstName: { contains: value } },
				{ middleName: { contains: value } },
				{ lastName: { contains: value } },
			],
		},
	});

	return authors;
};
