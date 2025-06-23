"use client";

import type { User } from "@prisma/client";
import { App, Avatar, Button, List, Skeleton } from "antd";
import { User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useState } from "react";
import deleteUser from "../mutations/deleteUser";

const roles = {
	USER: "مستخدم",
	EDITOR: "محرر",
	ADMIN: "مشرف",
};

const DeleteButton = ({
	id,
	email,
	disabled,
}: {
	id: string;
	email: string;
	disabled: boolean;
}) => {
	const { modal, notification } = App.useApp();

	const handleDelete = async () => {
		modal.warning({
			closable: true,
			maskClosable: true,
			title: "Delete user",
			content: `Are you sure to delete user with email ${email}?`,
			onOk: async () => {
				try {
					await deleteUser({ id });
				} catch (error: any) {
					notification.error({
						message: error.toString?.(),
						showProgress: true,
						pauseOnHover: true,
						placement: "bottomLeft",
					});
				}
			},
			okButtonProps: {
				danger: true,
			},
		});
	};

	return (
		<Button type="link" danger onClick={handleDelete} disabled={disabled}>
			حذف
		</Button>
	);
};

const UserList = ({
	users,
	count,
}: {
	users: User[];
	count: number;
}) => {
	const session = useSession();
	const router = useRouter();
	const [page, setPage] = useQueryState("page", parseAsInteger);

	return (
		<Skeleton avatar loading={false} active>
			<List
				// loading={isFetching}
				itemLayout="horizontal"
				dataSource={users}
				pagination={{
					pageSize: 10,
					// when deleting last record in a page it won't trigger page change. this might cause last remaining page to be not clickable so it stucks
					total: users.length === 0 ? count + 1 : count,
					current: page ?? 1,
					onChange: async (page, _pageSize) => {
						await setPage(page);
						router.refresh();
					},
				}}
				rowKey={(user) => user.id}
				renderItem={(user) => (
					<List.Item
						actions={[
							<DeleteButton
								key={user.id}
								id={user.id}
								email={user.username}
								disabled={user.id === session.data?.user?.id}
							/>,
						]}
					>
						<List.Item.Meta
							avatar={
								<Avatar>
									<User2 />
								</Avatar>
							}
							title={user.username}
							description={roles[user.role as keyof typeof roles]}
						/>
					</List.Item>
				)}
			/>
		</Skeleton>
	);
};

export default UserList;
