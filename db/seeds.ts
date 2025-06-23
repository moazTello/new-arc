import { hashPassword } from "@/lib/utils";
import { db } from "./index";

const seed = async () => {
	const email = process.env.EMAIL;
	const password = process.env.PASSWORD;
	const role = process.env.ROLE || "USER";

	if (!email || !password) return;

	const passwordHash = await hashPassword(password);
	await db.user.upsert({
		where: { username: email },
		create: { username: email, passwordHash, role },
		update: {},
	});
};

await seed()
