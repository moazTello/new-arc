"use client";

import type { Role } from "@/types";
import { App, Button, Form, Input, Row, Select, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import React, { useState } from "react";
import createUser from "../mutations/createUser";

type CreateUser = {
	email: string;
	password: string;
	role: Role;
};

const selectRoleOptions = [
	{
		value: "USER",
		label: "مستخدم",
	},
	{
		value: "EDITOR",
		label: "محرر",
	},
	{
		value: "ADMIN",
		label: "مشرف",
	},
];

const NewUserForm = () => {
	const { notification, message } = App.useApp();
	const [form] = useForm<CreateUser>();
	const [isPending, setPending] = useState(false);

	const handleSubmit = async (values: CreateUser) => {
		setPending(true);
		try {
			await createUser({
				email: values.email,
				password: values.password,
				role: values.role,
			});

			form.resetFields();
			setPending(false);
			message.success("Created!");
		} catch (error: any) {
			setPending(false);
			let message = "Error, failed to create";
			if (error.code === "P2002") {
				message = "email must be unique";
			} else if (error.name === "ZodError") {
				console.error("json:: ", JSON.parse(error.message));
				message = JSON.parse(error.message)?.[0]?.message || "invalid input";
			} else {
				message = error.toString?.();
			}
			notification.error({
				message,
				showProgress: true,
				pauseOnHover: true,
				placement: "bottomLeft",
			});
		}
	};

	return (
		<Form
			form={form}
			onFinish={handleSubmit}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 12 }}
			style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}
			autoComplete="off"
			requiredMark={false}
		>
			<FormItem
				name="email"
				label="البريد الالكتروني"
				rules={[{ required: true, message: "Please enter email!" }]}
			>
				<Input />
			</FormItem>
			<FormItem
				name="password"
				label="كلمة المرور"
				rules={[
					{ required: true, message: "Please enter password!" },
					{ min: 8, message: "minimum length is 8 characters" },
				]}
			>
				<Password />
			</FormItem>
			<FormItem
				name="role"
				label="الصلاحية"
				rules={[{ required: true, message: "Please select role!" }]}
			>
				<Select options={selectRoleOptions} />
			</FormItem>

			<Row justify="end" style={{ paddingRight: "4rem" }}>
				<Space>
					<Button type="primary" htmlType="submit" loading={isPending}>
						إنشاء
					</Button>
					<Button htmlType="reset">مسح</Button>
				</Space>
			</Row>
		</Form>
	);
};

export default NewUserForm;
