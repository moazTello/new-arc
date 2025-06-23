"use client";

import type { Author } from "@prisma/client";
import { App, Avatar, Button, Image, List } from "antd";
import useApp from "antd/es/app/useApp";
import dayjs from "dayjs";
import { PenIcon, Trash2, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React from "react";
import deleteAuthor from "../mutations/deleteAuthor";
import UpdateAuthorForm from "./UpdateAuthorForm";
// import Image from "next/image";

const DeleteButton = ({
	id,
	name,
	disabled,
}: {
	id: number;
	name: string;
	disabled?: boolean;
}) => {
	const { modal, notification } = App.useApp();

	const handleDelete = async () => {
		modal.warning({
			closable: true,
			maskClosable: true,
			direction: "rtl",
			title: `حذف المؤلف ${name}`,
			onOk: async () => {
				try {
					await deleteAuthor({ id });
				} catch (error: any) {
					notification.error({
						message: error.toString?.(),
						showProgress: true,
						pauseOnHover: true,
						placement: "bottomLeft",
					});
				}
			},
			okText: "تأكيد",
			okButtonProps: {
				danger: true,
			},
		});
	};

	return (
		<Button type="link" danger onClick={handleDelete} disabled={disabled}>
			<Trash2 size={16} />
		</Button>
	);
};

const AuthorsList = ({
	authors,
	count,
}: {
	authors: Author[];
	count: number;
}) => {
	const { modal } = useApp();
	const router = useRouter();
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

	const handleEdit = (record: Author) => {
		const { destroy } = modal.info({
			width: 600,
			destroyOnClose: true,
			closable: true,
			maskClosable: true,
			title: `ID ${record.id}`,
			content: (
				<UpdateAuthorForm
					initialValues={{
						id: record.id,
						prefix: record.prefix ?? undefined,
						firstName: record.firstName,
						middleName: record.middleName ?? undefined,
						lastName: record.lastName,
						photoUrl: record.photoUrl ?? undefined,
						birthDate: dayjs(record.birthDate),
						deathDate: record.deathDate ? dayjs(record.deathDate) : undefined,
						overview: record.overview ?? undefined,
					}}
					callback={() => destroy()}
				/>
			),
			footer: null,
			style: { marginTop: -70 },
		});
	};

	return (
		<List
			// loading={isFetching}
			itemLayout="horizontal"
			dataSource={authors}
			pagination={{
				pageSize: 10,
				// when deleting last record in a page it won't trigger page change. this might cause last remaining page to be not clickable so it stucks
				total: authors.length === 0 ? count + 1 : count,
				current: page,
				onChange: async (page, _pageSize) => {
					await setPage(page);
					router.refresh();
				},
			}}
			rowKey={(author) => author.id}
			renderItem={(author) => (
				<List.Item
					actions={[
						<Button
							key={`edit_${author.id}`}
							onClick={() => handleEdit(author)}
							type="link"
						>
							<PenIcon size={16} />
						</Button>,
						<DeleteButton
							key={author.id}
							id={author.id}
							name={`${author.firstName} ${author.middleName} ${author.lastName}`}
						/>,
					]}
				>
					<List.Item.Meta
						avatar={
							<Avatar size={50} src={author.photoUrl}>
								<User2 />
							</Avatar>
						}
						title={`${author.prefix} ${author.firstName} ${author.middleName} ${author.lastName}`}
						description={`(${author.birthDate}${author.deathDate ? ` - ${author.deathDate}` : ""}) ${author.overview}`}
					/>
				</List.Item>
			)}
		/>
	);
};

export default AuthorsList;
