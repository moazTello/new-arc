"use client";
import { Menu, type MenuProps } from "antd";
import { Header as Antd_Header } from "antd/es/layout/layout";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { logout } from "../auth/actions";
import styles from "../styles/Dashboard.module.css";

type MenuItem = Required<MenuProps>["items"][number];

const Header = ({ role }: { role: string }) => {
	const pathname = usePathname();

	const menuItems: MenuItem[] = [
		{
			label: <Link href="/books">الكتب</Link>,
			key: "/books",
		},
		["ADMIN", "EDITOR"].find((r) => r === role)
			? {
					label: <Link href="/authors">المؤلفين</Link>,
					key: "/authors",
				}
			: null,
		role === "ADMIN"
			? {
					label: <Link href="/users">المستخدمين</Link>,
					key: "/users",
				}
			: null,
		{
			label: <Link href="/settings">الإعدادات</Link>,
			key: "/settings",
		},
		{
			label: "تسجيل الخروج",
			key: "/logout",
			icon: <LogOut size={14} />,
			className: styles.logoutButton,
			onClick: () => logout(),
		},
	];

	return (
		<Antd_Header className={styles.header} dir="rtl">
			<Image
				alt="Voton_logo"
				src="/voton-logo-new.png"
				priority
				height={24}
				width={91}
			/>
			<Menu
				theme="light"
				mode="horizontal"
				items={menuItems}
				activeKey={pathname || "/"}
				style={{ flex: 1, minWidth: 0, marginLeft: 12 }}
			/>
		</Antd_Header>
	);
};

export default Header;
