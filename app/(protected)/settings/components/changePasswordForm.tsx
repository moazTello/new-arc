"use client";

import styles from "@/app/styles/Settings.module.css";
import { Alert, App, Button, Form, Input, Row } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword } from "../actions";

const { Item: FormItem } = Form;
const { Password } = Input;

type ChangePasswordForm = {
	currentPassword: string;
	newPassword: string;
};

type Props = {
	username?: string;
	userRole?: string;
};

const roles = {
	USER: "مستخدم",
	EDITOR: "محرر",
	ADMIN: "مشرف",
};

export const ChangePasswordForm = ({ username, userRole }: Props) => {
	const { message } = App.useApp();
	const router = useRouter();
	const [form] = Form.useForm<ChangePasswordForm>();
	const [error, setError] = useState("");
	const [isPending, setPending] = useState(false);

	const handleSubmit = async (values: ChangePasswordForm) => {
		if (values.currentPassword === values.newPassword) {
			setError("New password cannot be the old one!");
			return;
		}
		try {
			setPending(true);
			await changePassword(values);
			message.success("Updated!");
			form.resetFields();
			router.refresh();
			setPending(false);
		} catch (error: any) {
			setPending(false);
			message.error("Failed!");
			if (error.message?.includes("password")) {
				setError("Sorry, incorrect password");
			} else {
				setError(`${error.toString()}`);
			}
		}
	};

	const handleAlertClose = () => setError("");

	return (
		<div className={styles.block} style={{ alignSelf: "center" }}>
			<Form<ChangePasswordForm>
				form={form}
				layout="vertical"
				style={{ width: 300 }}
				onFinish={handleSubmit}
			>
				<FormItem hidden={!error}>
					<Alert message={error} type="warning" onClose={handleAlertClose} />
				</FormItem>
				<FormItem label="البريد الإلكتروني" layout="horizontal">
					<strong>{username}</strong>
				</FormItem>
				<FormItem label="الصلاحية" layout="horizontal">
					<strong>
						{userRole ? roles[userRole as keyof typeof roles] : "N/A"}
					</strong>
				</FormItem>
				<FormItem
					label="كلمة المرور الحالية"
					name="currentPassword"
					rules={[
						{ required: true, message: "" },
						{ min: 8, message: "minimum length is 8 characters" },
					]}
				>
					<Password autoComplete="off" />
				</FormItem>

				<FormItem
					label="كلمة المرور الجديدة"
					name="newPassword"
					rules={[
						{ required: true, message: "" },
						{ min: 8, message: "minimum length is 8 characters" },
					]}
				>
					<Password autoComplete="new-password" />
				</FormItem>

				<FormItem>
					<Row justify="center">
						<Button htmlType="submit" loading={isPending}>
							حفظ التغيير
						</Button>
					</Row>
				</FormItem>
			</Form>
		</div>
	);
};
