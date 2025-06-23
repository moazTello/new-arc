"use client";
import type { Author, Book } from "@prisma/client";
import { App } from "antd";
import dayjs from "dayjs";
import React, { useState, type ComponentProps } from "react";
import updateProject from "../mutations/updateBook";
import BookForm from "./BookForm";

type Props = {
	book: Book & { Author: Author | null };
	callback: (result: Book) => void;
};

const UpdateBookForm = ({ book, callback }: Props) => {
	const { notification, message } = App.useApp();
	const [isDirty, setDirty] = useState(false);

	const handleSubmit: ComponentProps<typeof BookForm>["onSubmit"] = async (
		values,
		form,
	) => {
		const { ...restValues } = values;

		try {
			const res = await updateProject({
				...restValues,
				id: book.id,
			});

			form.resetFields();
			callback(res);
			message.success("Updated!");
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			notification.error({
				message: error.toString?.(),
				showProgress: true,
				pauseOnHover: true,
				placement: "bottomLeft",
			});
			console.error("failed to update project: ", error);
		}
	};

	return (
		<BookForm
			onSubmit={handleSubmit}
			isLoading={false}
			onFieldsChange={() => setDirty(true)}
			onReset={() => setDirty(false)}
			disableButtons={!isDirty}
			submitText="تحديث"
			initialValues={{
				...book,
				releaseDate: dayjs(book.releaseDate, "YYYY"),
				printDate: dayjs(book.printDate),
				authorId: {
					value: book.authorId,
					label: `${book.Author?.firstName} ${book.Author?.middleName} ${book.Author?.lastName}`,
				},
			}}
		/>
	);
};

export default UpdateBookForm;
