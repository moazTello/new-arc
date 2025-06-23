"use client";

import { App, Button, DatePicker, Form, Input, Row, Space, Upload } from "antd";
import { type FormProps, useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import type { RcFile } from "antd/es/upload";
import type { Dayjs } from "dayjs";
import React, { useState } from "react";
import createAuthor from "../mutations/createAuthor";
import { CreateAuthorSchema } from "../schemas";

type CreateAuthor = {
	prefix?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	overview: string;
	birthDate: Dayjs;
	deathDate?: Dayjs;
	photo?: RcFile;
};

const NewAuthorForm = ({
	callback,
	...props
}: FormProps<CreateAuthor> & {
	callback?: () => void;
}) => {
	const { notification, message } = App.useApp();
	const [form] = useForm<CreateAuthor>();
	const [file, setFile] = useState<RcFile>();
	const [isPending, setPending] = useState(false);

	const handleSubmit = async (values: CreateAuthor) => {
		const {
			prefix,
			firstName,
			middleName,
			lastName,
			overview,
			birthDate,
			deathDate,
		} = CreateAuthorSchema.parse({
			...values,
			birthDate: values.birthDate.get("year").toString(),
			deathDate: values.deathDate?.get("year").toString(),
		});
		setPending(true);

		if (file && file?.size > 1024 * 1024) {
			form.setFields([
				{
					name: "photo",
					errors: ["حجم الصورة يجب أن يكون أقل من 1MB"],
				},
			]);

			setPending(false);
			return false;
		}

		try {
			const res = await createAuthor({
				prefix,
				firstName,
				middleName,
				lastName,
				overview,
				birthDate: birthDate,
				deathDate: deathDate,
				photo: file,
			});

			if (res?.error) {
				throw res.error;
			}

			form.resetFields();
			setPending(false);
			message.success("Created!");
			setFile(undefined);
			callback?.();
		} catch (error: any) {
			setPending(false);
			let message: string;

			if (error.name === "ZodError") {
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

	const handleReset = () => {
		form.resetFields();
		setFile(undefined);
	};

	return (
		<Form<CreateAuthor>
			form={form}
			onFinish={handleSubmit}
			onReset={handleReset}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 12 }}
			style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}
			autoComplete="off"
			dir="rtl"
			{...props}
		>
			<FormItem name="prefix" label="اللقب">
				<Input />
			</FormItem>
			<FormItem name="firstName" label="الاسم" rules={[{ required: true }]}>
				<Input />
			</FormItem>
			<FormItem name="middleName" label="الاسم الأوسط">
				<Input />
			</FormItem>
			<FormItem name="lastName" label="الكنية" rules={[{ required: true }]}>
				<Input />
			</FormItem>
			<FormItem name="overview" label="لمحة عن المؤلف">
				<Input />
			</FormItem>
			<FormItem
				name="birthDate"
				label="تاريخ الميلاد"
				rules={[{ required: true, message: "Please select date" }]}
			>
				<DatePicker picker="year" />
			</FormItem>
			<FormItem name="deathDate" label="تاريخ الوفاة">
				<DatePicker picker="year" />
			</FormItem>
			<Form.Item name="photo" label="صورة المؤلف" valuePropName="">
				<Upload
					listType="picture-card"
					accept="image/*"
					maxCount={1}
					beforeUpload={(file) => {
						// form.setFieldsValue({ photo: file });
						setFile(file);
						return false;
					}}
				>
					<Button>Upload</Button>
				</Upload>
			</Form.Item>
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

export default NewAuthorForm;
