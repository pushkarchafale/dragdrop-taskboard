import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Form, ModalProps, Input, Upload, Button } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import AppContext from '../shared/AppContext';

export type TaskboardItemFormValues = Pick<
	TaskboardItem,
	'title' | 'name' | 'description' | 'status' | 'profileImg'
>;

type TaskboardItemFormModalProps = Pick<ModalProps, 'visible'> & {
	initialValues: TaskboardItemFormValues;
	onCancel: VoidFunction;
	onOk: (values: TaskboardItem) => void;
};

function TaskboardItemFormModal({
	visible,
	initialValues,
	onCancel,
	onOk,
}: TaskboardItemFormModalProps) {
	const [form] = Form.useForm<TaskboardItemFormValues>();

	const [profileImg, setProfileImg] = useState<null | Blob>(null);

	const inputRef = useRef<Input>(null);

  let appContext = useContext(AppContext);

	useEffect(() => {
		if (visible) {
			// Focus on the first input when the modal is opened
			inputRef.current?.focus();
			form.resetFields();
		}
	}, [form, visible]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const normFile = (e: any) => {
		// eslint-disable-next-line no-console
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	return (
		<Modal
			title="Add Item"
			visible={visible}
			destroyOnClose
			// To make dynamically changing initialValues work with Form
			forceRender
			onCancel={onCancel}
			onOk={() => form.submit()}
		>
			<Form
				autoComplete="off"
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onFinish={async (values) => {
					appContext.setIsLoading(true);
					values.status = TaskboardItemStatus.APPLICANTS;
					let formData = new FormData();

					formData.append('name', values.name);
					formData.append('title', values.title);
					formData.append('description', values.description);
					formData.append('status', values.status);

					if (profileImg) {
						formData.append('profileImg', profileImg);
					}

					let applicantCreated = await axios.post(
						'http://ayrataskdemo.eu-west-1.elasticbeanstalk.com/api/user-profile',
						formData
					);
					values = applicantCreated.data
						.applicantCreated as TaskboardItem;
					onOk(values as TaskboardItem);
					form.resetFields();
					onCancel();
					appContext.setIsLoading(false);
				}}
			>
				<Form.Item
					name="title"
					label="Job Title"
					rules={[
						{ required: true, message: "'Job Title' is required" },
						{
							max: 100,
							message:
								"'Job Title' can not be longer than 100 characters",
						},
					]}
				>
					<Input ref={inputRef} autoFocus />
				</Form.Item>
				<Form.Item
					name="name"
					label="Name"
					rules={[
						{ required: true, message: "'Name' is required" },
						{
							max: 100,
							message:
								"'Name' can not be longer than 100 characters",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="description"
					label="Description"
					rules={[
						{
							required: true,
							message: "'Description' is required",
						},
						{
							max: 400,
							message:
								"'Description' can not be longer than 400 characters",
						},
					]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item
					name="upload"
					label="Upload"
					valuePropName="fileList"
					getValueFromEvent={normFile}
					extra="Upload you profile pic"
				>
					<Upload
						name="logo"
						listType="picture"
						beforeUpload={(file) => {
							setProfileImg(file);
							return false;
						}}
					>
						<Button icon={<UploadOutlined />}>
							Click to upload
						</Button>
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default TaskboardItemFormModal;
