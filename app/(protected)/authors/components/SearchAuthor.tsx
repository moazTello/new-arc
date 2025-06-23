"use client";

import Search from "antd/es/input/Search";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

const SearchAuthor = () => {
	const router = useRouter();
	const [q, setQ] = useQueryState("q");

	const handleSearch = async (value: string) => {
		if (!value.trim()) {
			await setQ(null);
		} else {
			await setQ(value.trim());
		}

		router.refresh();
	};

	const clear = async () => {
		await setQ(null);
		router.refresh();
	};

	return (
		<Search
			placeholder="بحث ..."
			onSearch={handleSearch}
			allowClear
			onClear={clear}
		/>
	);
};

export default SearchAuthor;
