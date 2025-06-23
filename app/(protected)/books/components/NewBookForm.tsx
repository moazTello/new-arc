"use client";
import { App } from "antd";
import React, { type ComponentProps } from "react";

import createProject from "../mutations/createBook";
import getProjects from "../queries/getBooks";
import BookForm from "./BookForm";

const NewProjectForm = () => {
	const { notification, message } = App.useApp();
	// const [createProjectMutation, { isLoading }] = useMutation(createProject);

	const handleSubmit: ComponentProps<typeof BookForm>["onSubmit"] = async (
		values,
		form,
	) => {
		try {
			await createProject(values);

			form.resetFields();
			message.success("Created!");
		} catch (error: any) {
			notification.error({
				message:
					error.code === "P2002" ? "book must be unique" : error.toString?.(),
				showProgress: true,
				pauseOnHover: true,
				placement: "bottomLeft",
			});
			console.error("failed to create new project: ", error);
		}
	};

	return <BookForm onSubmit={handleSubmit} isLoading={false} />;
};

export default NewProjectForm;
