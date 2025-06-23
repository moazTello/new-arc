import bcrypt from "bcrypt";

const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS || "");

if (!SALT_ROUNDS || !Number.isInteger(SALT_ROUNDS)) {
	throw new Error("SALT_ROUNDS environment variable is not set");
}

export const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string) => {
	return await bcrypt.compare(password, hash);
};

const alphabetMap = {
	ا: "A",
	ب: "B",
	ت: "T",
	ث: "T",
	ج: "J",
	ح: "H",
	خ: "K",
	د: "D",
	ذ: "D",
	ر: "R",
	ز: "Z",
	س: "S",
	ش: "S",
	ص: "S",
	ض: "D",
	ط: "T",
	ظ: "Z",
	ع: "A",
	غ: "G",
	ف: "F",
	ق: "Q",
	ك: "K",
	ل: "L",
	م: "M",
	ن: "N",
	ه: "H",
	و: "W",
	ي: "Y",
	أ: "A",
	إ: "E",
	ؤ: "O",
	ئ: "I",
	آ: "A",
	ة: "H",
	ى: "A",
	ء: "A",
};

export const generateBookCode = (
	authorBookCount: number,
	authorFirstName: string,
	authorLastName: string,
	releaseYear: string,
) => {
	const authorPart =
		// @ts-ignore
		(alphabetMap[authorFirstName[0]] ?? authorFirstName[0]) +
		// @ts-ignore
		(alphabetMap[authorLastName[0]] ?? authorLastName[0]);

	let lastDigits: string;

	if (authorBookCount < 10) {
		lastDigits = `00${authorBookCount}`;
	} else if (authorBookCount < 100) {
		lastDigits = `0${authorBookCount}`;
	} else {
		lastDigits = String(authorBookCount);
	}

	const code = `GW${authorPart}${releaseYear.slice(2, 4)}${lastDigits}`;
	console.table({ authorFirstName, authorLastName, authorPart, code });
	return code;
};
