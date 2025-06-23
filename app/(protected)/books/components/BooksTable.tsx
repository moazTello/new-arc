"use client";
import type { Author, Book, Prisma } from "@prisma/client";
import {
	App,
	Avatar,
	Button,
	Popover,
	Row,
	Space,
	Spin,
	Table,
	Typography,
} from "antd";
import Search from "antd/es/input/Search";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { BookIcon, PencilLine, SearchIcon, Trash, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ParserBuilder, type SetValues, useQueryStates } from "nuqs";
import React, { useMemo, useState, useTransition } from "react";
import deleteBook from "../mutations/deleteBook";
import { booksSearchParams } from "../searchParams";
import UpdateBookForm from "./UpdateForm";

const { Text } = Typography;

type BookWithAuthorRecord = Book & { Author: Author | null };

type Props = TableProps<BookWithAuthorRecord> & {
	data: BookWithAuthorRecord[];
	count: number;
	isAdmin: boolean;
};

const DEFAULT_ORDER_BY = {
	orderBy: "id",
	orderDir: "desc",
};

const SearchInput = ({
	index,
	confirm,
	// setPage,
	setSearchFilter,
	refresh,
}: {
	index: string;
	confirm: () => void;
	// setPage: (val: number) => void;
	setSearchFilter: SetValues<typeof booksSearchParams>;
	refresh: () => void;
}) => (
	<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
		<Search
			placeholder="بحث"
			onSearch={async (value) => {
				confirm();
				await setSearchFilter({
					q: index,
					value: value.trim() ?? null,
					page: 1,
				});
				refresh();
			}}
			enterButton
			width={200}
		/>
	</div>
);

const BooksTable = ({ data, count, isAdmin, ...props }: Props) => {
	const { modal, notification } = App.useApp();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useQueryStates(booksSearchParams);
	const [isPending, startTransition] = useTransition();

	const refresh = () => {
		startTransition(() => {
			router.refresh();
		});
	};

	const clearFilters = async () => {
		await setSearchFilter(null);
		refresh();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const columns = useMemo<ColumnsType<BookWithAuthorRecord>>(
		() =>
			(
				[
					{
						key: "code",
						title: "الكود",
						dataIndex: "code",
						width: 170,
						render: (value) => <Text copyable>{value}</Text>,
						filterIcon: <SearchIcon size={14} />,
						// filteredValue: searchFilter?.code || null,
						filterDropdown: ({ confirm }: FilterDropdownProps) => (
							<SearchInput
								index="code"
								confirm={confirm}
								setSearchFilter={setSearchFilter}
								refresh={refresh}
							/>
						),
					},
					{
						key: "name",
						title: "اسم الكتاب",
						fixed: "left",
						dataIndex: "name",
						filterIcon: <SearchIcon size={14} />,
						// filteredValue: searchFilter?.name || null,
						filterDropdown: ({ confirm }: FilterDropdownProps) => (
							<SearchInput
								index="name"
								confirm={confirm}
								setSearchFilter={setSearchFilter}
								refresh={refresh}
							/>
						),
					},
					{
						key: "author",
						title: "الكاتب",
						dataIndex: "Author",
						minWidth: 350,
						render: (_, { Author }) => (
							<Popover
								content={
									<div>
										<Avatar
											shape="square"
											style={{ margin: "auto", width: 100, height: 100 }}
											src={Author?.photoUrl}
										>
											<User2 />
										</Avatar>
										<div
											style={{ fontWeight: "bold" }}
										>{`${Author?.firstName} ${Author?.middleName || ""} ${Author?.lastName}`}</div>
										<span>{dayjs(Author?.birthDate).format("YYYY")}</span>
										<span>
											{Author?.deathDate &&
												` - ${dayjs(Author?.deathDate).format("YYYY")}`}
										</span>
										<div>{Author?.overview}</div>
									</div>
								}
							>
								<div style={{ cursor: "pointer" }}>
									{Author?.firstName} {Author?.middleName || ""}{" "}
									{Author?.lastName}
								</div>
							</Popover>
						),
						filterIcon: <SearchIcon size={14} />,
						// filteredValue: searchFilter?.name || null,
						filterDropdown: ({ confirm }: FilterDropdownProps) => (
							<SearchInput
								index="Author"
								confirm={confirm}
								setSearchFilter={setSearchFilter}
								refresh={refresh}
							/>
						),
					},
					{
						key: "translator",
						title: "المترجم",
						dataIndex: "translator",
						filterIcon: <SearchIcon size={14} />,
						// filteredValue: searchFilter?.name || null,
						filterDropdown: ({ confirm }: FilterDropdownProps) => (
							<SearchInput
								index="translator"
								confirm={confirm}
								setSearchFilter={setSearchFilter}
								refresh={refresh}
							/>
						),
					},
					{
						key: "checker",
						title: "المحقق",
						dataIndex: "checker",
						filterIcon: <SearchIcon size={14} />,
						// filteredValue: searchFilter?.name || null,
						filterDropdown: ({ confirm }: FilterDropdownProps) => (
							<SearchInput
								index="checker"
								confirm={confirm}
								setSearchFilter={setSearchFilter}
								refresh={refresh}
							/>
						),
					},
					// {
					//   key: "serverNumber",
					//   title: "Server",
					//   dataIndex: "serverNumber",
					//   width: 100,
					//   filterMultiple: false,
					//   filters: new Array(serversData?.count || 0)
					//     .fill(0)
					//     .map((_, index) => ({ value: index + 1, text: `${index + 1}` })),
					//   onFilterDropdownOpenChange: (visible) => {
					//     if (visible) serversQuery.refetch();
					//   },
					//   filteredValue: searchFilter?.serverNumber ? [searchFilter.serverNumber] : null,
					// },
					{
						key: "pagesCount",
						title: "عدد الصفحات",
						dataIndex: "pagesCount",
						width: 150,
						sorter: true,
						sortDirections: ["ascend", "descend", "ascend"],
					},
					{
						key: "releaseDate",
						title: "تاريخ الإصدار",
						dataIndex: "releaseDate",
						width: 150,
						sorter: true,
						sortDirections: ["ascend", "descend", "ascend"],
						render: (_, record) => dayjs(record.releaseDate).format("YYYY"),
					},
					{
						key: "weight",
						title: "الوزن",
						dataIndex: "weight",
						width: 150,
					},
					{
						key: "deminsions",
						title: "الأبعاد",
						dataIndex: "deminsions",
						width: 180,
						render: (_, record) =>
							`${record.length} × ${record.width} × ${record.height}`,
					},
					{
						key: "printDate",
						title: "تاريخ الطباعة",
						dataIndex: "printDate",
						width: 150,
						sorter: true,
						sortDirections: ["ascend", "descend", "ascend"],
						render: (_, record) => dayjs(record.printDate).format("DD/MM/YYYY"),
					},
					{
						key: "actions",
						align: "center",
						width: 100,
						hidden: !isAdmin,
						render: (_, record) => {
							const handleDelete = async () => {
								modal.warning({
									closable: true,
									maskClosable: true,
									title: "Delete project",
									content: `Are you sure to delete project ${record.code}?`,
									onOk: async () => {
										try {
											deleteBook({ id: record.id });
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
							const handleEdit = () => {
								const { destroy } = modal.info({
									width: 800,
									destroyOnClose: true,
									closable: true,
									maskClosable: true,
									icon: <BookIcon color="#096dd9" style={{ marginLeft: 10 }} />,
									title: `${record.name}`,
									content: (
										<UpdateBookForm book={record} callback={() => destroy()} />
									),
									footer: null,
									style: { marginTop: -70 },
								});
							};
							return (
								<Space size="middle">
									<PencilLine
										size={14}
										color="#096dd9"
										onClick={handleEdit}
										style={{ cursor: "pointer" }}
									/>
									<Trash
										size={14}
										color="red"
										onClick={handleDelete}
										style={{ cursor: "pointer" }}
									/>
								</Space>
							);
						},
					},
				] as ColumnsType<BookWithAuthorRecord>
			).filter((col) => !col.hidden),
		[modal, setSearchFilter, isAdmin, notification],
	);

	const handleChange: TableProps<BookWithAuthorRecord>["onChange"] = async (
		_pagination,
		_filters,
		sorter,
	) => {
		if (!Array.isArray(sorter)) {
			if (sorter.order && sorter.columnKey) {
				await setSearchFilter({
					orderBy: String(sorter.columnKey),
					orderDir: sorter.order === "ascend" ? "asc" : "desc",
				});
			} else {
				await setSearchFilter(DEFAULT_ORDER_BY);
			}
			refresh();
		}
	};

	return (
		<Table<BookWithAuthorRecord>
			{...props}
			columns={columns}
			loading={false}
			dataSource={data}
			onChange={handleChange}
			rowKey={(record) => record.id}
			scroll={{ x: 1800 }}
			title={() => (
				<Row justify="end">
					<Space size="middle">
						{isPending ? <Spin /> : null}
						<Button onClick={() => refresh()}>تحديث</Button>
						<Button danger disabled={!searchFilter} onClick={clearFilters}>
							مسح البحث
						</Button>
					</Space>
				</Row>
			)}
			pagination={{
				pageSize: searchFilter.pageSize || 10,
				total: count,
				current: searchFilter.page || 1,
				onChange: (page, _pageSize) => {
					setSearchFilter({
						page,
					});
				},
				showSizeChanger: true,
				onShowSizeChange: (_current, size) => {
					setSearchFilter({
						pageSize: size,
					});
				},
			}}
		/>
	);
};

export default BooksTable;
