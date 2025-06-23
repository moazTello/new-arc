"use client";
import { Alert, Button, Form, Input, Row } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../../actions";

const { Item: FormItem } = Form;
const { Password } = Input;

type LoginForm = {
	username: string;
	password: string;
};

export const LoginForm = () => {
	const router = useRouter();
	const [form] = Form.useForm<LoginForm>();
	const [error, setError] = useState("");
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = async (values: LoginForm) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("username", values.username);
			formData.append("password", values.password);
			formData.append("redirectTo", "/books");
			const res = await login(formData);

			if (res?.error) {
				throw res.error;
			}

			form.resetFields();
		} catch (error: any) {
			setLoading(false);
			setError(`${error}`);
		}
	};

	const handleAlertClose = () => setError("");

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				width: "100%",
				height: "100vh",
				backgroundColor: "white",
			}}
		>
			<Title>تسجيل الدخول</Title>
			<Form<LoginForm>
				form={form}
				name="login"
				layout="vertical"
				style={{ width: 300 }}
				onFinish={handleSubmit}
			>
				<FormItem hidden={!error}>
					<Alert message={error} type="warning" onClose={handleAlertClose} />
				</FormItem>
				<FormItem
					label="المستخدم"
					name="username"
					rules={[{ required: true, message: "Please enter your username!" }]}
				>
					<Input autoFocus />
				</FormItem>

				<FormItem
					label="كلمة المرور"
					name="password"
					rules={[{ required: true, message: "Please enter your password!" }]}
				>
					<Password autoComplete="current-password" />
				</FormItem>

				<FormItem>
					<Row justify="center">
						<Button
							type="primary"
							htmlType="submit"
							loading={isLoading}
							style={{ width: "50%", borderRadius: 24 }}
						>
							تسجيل الدخول
						</Button>
					</Row>
				</FormItem>
			</Form>
		</div>
	);
};
