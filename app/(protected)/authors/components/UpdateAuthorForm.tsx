"use client";

import type { Author } from "@prisma/client";
import {
	App,
	Button,
	DatePicker,
	Form,
	Image,
	Input,
	Row,
	Space,
	Upload,
} from "antd";
import { type FormProps, useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import type { RcFile } from "antd/es/upload";
import type { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";
import updateAuthor from "../mutations/updateAuthor";
import { CreateAuthorSchema } from "../schemas";

type UpdateAuthorProps = FormProps<AuthorFormValues> & {
	callback?: () => void;
	initialValues: AuthorFormValues;
};

type AuthorFormValues = {
	prefix?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	overview?: string;
	birthDate: Dayjs;
	deathDate?: Dayjs;
};

const UpdateAuthorForm = ({
	initialValues,
	callback,
	...props
}: UpdateAuthorProps) => {
	const { notification, message } = App.useApp();
	const [form] = useForm<AuthorFormValues>();
	const [isPending, setPending] = useState(false);
	const [file, setFile] = useState<RcFile | null>(null);
	const [photoChanged, setPhotoChanged] = useState(false);

	const handleSubmit = async (values: AuthorFormValues) => {
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

		let photoToSend: RcFile | null | undefined = undefined;

		if (file === null) {
			photoToSend = null; // Image removed
		} else if (photoChanged && file) {
			photoToSend = file; // Image changed
		}

		try {
			const res = await updateAuthor({
				id: initialValues.id,
				prefix,
				firstName,
				middleName,
				lastName,
				overview,
				birthDate: birthDate,
				deathDate: deathDate,
				photo: photoToSend,
			});

			if (res?.error) {
				throw res.error;
			}

			form.resetFields();
			setPending(false);
			message.success("Updated!");
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
		setFile(null);
		setPhotoChanged(false);
	};

	return (
		<Form<AuthorFormValues>
			form={form}
			onFinish={handleSubmit}
			onReset={handleReset}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 12 }}
			style={{ width: "100%", maxWidth: 500, alignSelf: "center" }}
			autoComplete="off"
			dir="rtl"
			initialValues={initialValues}
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
			<Form.Item label="صورة المؤلف">
				{initialValues.photoUrl && !file && (
					<Image src={initialValues.photoUrl} width={200} />
				)}
			</Form.Item>
			<Form.Item name="photo" label="تغيير صورة المؤلف" valuePropName="">
				<Upload
					listType="picture-card"
					accept="image/*"
					maxCount={1}
					showUploadList={!!file}
					beforeUpload={(file) => {
						setFile(file);
						setPhotoChanged(true);
						return false;
					}}
					onRemove={() => {
						setFile(null);
						setPhotoChanged(true);
						return true;
					}}
				>
					{!file && <Button>Upload</Button>}
				</Upload>
			</Form.Item>
			<Row justify="end" style={{ paddingRight: "4rem" }}>
				<Space>
					<Button type="primary" htmlType="submit" loading={isPending}>
						تعديل
					</Button>
					<Button htmlType="reset">مسح</Button>
				</Space>
			</Row>
		</Form>
	);
};

export default UpdateAuthorForm;
