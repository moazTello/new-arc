import { auth } from "@/lib/auth";
import Database from "better-sqlite3";
import { type NextRequest, NextResponse } from "next/server";

export const GET = auth((request) => {
	if (request.auth?.user.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	try {
		const db = new Database("db/db.sqlite");
		const backup = db.serialize();
		const buffer = Buffer.from(backup);

		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const filename = `db-${year}-${month}-${day}.sqlite`;

		const headers = {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${filename}"`,
		};

		return new NextResponse(buffer, { headers });
	} catch (error: any) {
		console.error("Error exporting database:", error);
		return NextResponse.json(
			{ error: "Failed to export database" },
			{ status: 500 },
		);
	}
});
