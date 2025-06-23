"use client";

import { useDebounce } from "@/lib/useDebounce";
import type { Author } from "@prisma/client";
import { Avatar, Select, Spin } from "antd";
import { User2 } from "lucide-react";
import type React from "react";
import { type ComponentProps, useState } from "react";
import { searchAuthors } from "../queries/getAuthors";

type AuthorOption = Author & {
	key: string | number;
	value: string | number;
	label: string;
};

function SelectAuthor(props: ComponentProps<typeof Select>) {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<AuthorOption[]>([]);

	const debounceFetcher = useDebounce(async (value: string) => {
		if (!value.trim()) {
			return;
		}

		setFetching(true);
		try {
			const res = await searchAuthors(value);
			const list = res.map((author) => ({
				key: author.id,
				value: author.id,
				label: `${author.firstName} ${author.middleName} ${author.lastName}`,
				...author,
			}));
			setOptions(list);
			setFetching(false);
		} catch (error) {
			setFetching(false);
			console.error("failed to fetch select options");
		}
	}, 500);

	const handleSearch = (searchString: string) => debounceFetcher(searchString);

	return (
		<Select
			showSearch
			filterOption={false}
			onSearch={handleSearch}
			notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
			options={options}
			optionRender={(option) => (
				<div
					key={option.data.id}
					style={{ display: "flex", alignItems: "center" }}
				>
					<Avatar
						style={{ marginLeft: 8 }}
						size={50}
						src={option.data.photoUrl}
					>
						<User2 />
					</Avatar>
					{option.label}
				</div>
			)}
			{...props}
		/>
	);
}

export default SelectAuthor;
