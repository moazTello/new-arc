"use client";

import styles from "@/app/styles/Settings.module.css";
import { Button, Row } from "antd";
import React from "react";

const Exports = () => {
	// const handleExcelExport = async () => {
	// 	window.open("/api/exports/xlsx", "_blank");
	// };
	const handleBackup = async () => {
		window.open("/settings/exports/backup", "_blank");
	};

	return (
		<div className={styles.block}>
			<Row justify="space-around" style={{ minWidth: 300 }}>
				{/* <Button onClick={handleExcelExport}>export to excel</Button> */}
				<Button onClick={handleBackup}>نسخ احتياطي</Button>
			</Row>
		</div>
	);
};

export default Exports;
