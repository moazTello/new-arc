"use client";
import {
	Button,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
} from "antd";
import { type FormInstance, type FormProps, useForm } from "antd/es/form/Form";
import AntdFormItem from "antd/es/form/FormItem";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import SelectAuthor from "./SelectAuthor";

const FormItem = AntdFormItem<Book>;

type Book = {
	code: string;
	name: string;
	translator?: string;
	checker?: string;
	pagesCount: number;
	releaseDate: string;
	weight: string;
	width: string;
	length: string;
	height: string;
	printDate: string;
	bookUrl: string;
	authorId: number;
};

type SubmitValues = Book & {
	releaseDate: Dayjs;
	printDate: Dayjs;
};

type Props = {
	onSubmit: (values: Book, form: FormInstance<SubmitValues>) => void;
	isLoading: boolean;
	disableButtons?: boolean;
	submitText?: string;
} & Omit<FormProps<SubmitValues>, "onFinish" | "form">;

const BookForm = ({
	onSubmit,
	isLoading,
	disableButtons,
	submitText,
	...props
}: Props) => {
	const [form] = useForm<SubmitValues>();

	const handleSubmit = (values: SubmitValues) => {
		// console.table({
		//   ...values,
		//   releaseDate: values.releaseDate.get("year"),
		//   printDate: values.printDate.toISOString(),
		// });
		onSubmit(
			{
				...values,
				releaseDate: values.releaseDate.get("year").toString(),
				printDate: values.printDate.toISOString(),
			},
			form,
		);
	};

	return (
		<Form<SubmitValues>
			form={form}
			onFinish={handleSubmit}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 16 }}
			style={{ width: "100%", maxWidth: 1000 }}
			autoComplete="off"
			{...props}
		>
			<FormItem
				name="name"
				label="الاسم"
				rules={[
					{
						required: true,
						message: "",
					},
				]}
			>
				<Input />
			</FormItem>

			<FormItem
				name="authorId"
				label="الكاتب"
				rules={[{ required: true, message: "" }]}
			>
				<SelectAuthor />
			</FormItem>

			<FormItem name="checker" label="المحقق">
				<Input />
			</FormItem>

			<FormItem name="translator" label="المترجم">
				<Input />
				{/* <Select
          // options={serverOptions}
          style={{ width: 150 }}
        // loading={isFetching}
        // onDropdownVisibleChange={(open) => open && refetch()}
        /> */}
			</FormItem>

			<FormItem
				name="width"
				label="العرض"
				rules={[{ required: true, message: "" }]}
			>
				<Input />
			</FormItem>
			<FormItem
				name="length"
				label="الطول"
				rules={[{ required: true, message: "" }]}
			>
				<Input />
			</FormItem>
			<FormItem
				name="height"
				label="الارتفاع"
				rules={[{ required: true, message: "" }]}
			>
				<Input />
			</FormItem>

			<FormItem
				name="weight"
				label="الوزن"
				rules={[{ required: true, message: "" }]}
			>
				<Input />
			</FormItem>

			<FormItem
				name="pagesCount"
				label="عدد الصفحات"
				rules={[{ required: true, message: "" }]}
			>
				<InputNumber min={1} />
			</FormItem>

			<FormItem
				name="releaseDate"
				label="سنة الاصدار"
				rules={[{ required: true, message: "" }]}
				normalize={(value) =>
					typeof value === "string" ? dayjs(value, "YYYY") : value
				}
			>
				<DatePicker picker="year" format="YYYY" />
			</FormItem>

			<FormItem
				name="printDate"
				label="تاريخ الطباعة"
				rules={[{ required: true, message: "" }]}
			>
				<DatePicker />
			</FormItem>

			<FormItem
				name="bookUrl"
				label="رابط الكتاب"
				rules={[{ required: true, message: "" }]}
			>
				<Input style={{ direction: "ltr" }} />
			</FormItem>

			<Row justify="end" style={{ paddingRight: "4rem" }}>
				<Space>
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading}
						disabled={!!disableButtons}
					>
						{submitText ?? "إنشاء"}
					</Button>
					<Button htmlType="reset" disabled={!!disableButtons}>
						مسح
					</Button>
				</Space>
			</Row>
		</Form>
	);
};

export default BookForm;
