import { Card, Typography, Image } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import BaseTooltip from '../shared/BaseTooltip';
import { colors } from '../shared/SharedUtils';
import Avatar from 'antd/lib/avatar/avatar';

interface StyledCardProps {
	$isDragging: boolean;
}

const StyledCard = styled(Card)<StyledCardProps>`
	margin: 0.5rem;
	background-color: ${({ $isDragging }) =>
		$isDragging ? '#fafafa' : '#fff'};
	border-radius: 5px;
	transform: rotate(${({ $isDragging }) => ($isDragging ? '10' : '0')}deg);

	.ant-card-body {
		display: flex;
		flex-direction: row;
		flex: inherit;
	}
	.avatar-container {
		width: 90px;
	}
`;

const TaskboardItemCardTitle = styled(Typography.Title)`
	white-space: pre-wrap;
	// To make ellipsis of the title visible.
	// Without this margin, it can be go behind the "extra" component.
	// So, we give it a little space.
	margin-right: 0.25rem;
	&.ant-typography {
		color: ${colors.columnTitleColor};
		margin-bottom: 0px;
	}
`;

export interface TaskboardItemCardProps {
	item: TaskboardItem;
	isDragging: boolean;
	status: TaskboardItemStatus;
	onEdit: (itemToEdit: TaskboardItem) => void;
	onDelete: (args: {
		status: TaskboardItemStatus;
		itemToDelete: TaskboardItem;
	}) => void;
}

function TaskboardItemCard({
	item,
	status,
	isDragging,
	onEdit,
	onDelete,
}: TaskboardItemCardProps) {
	return (
		<StyledCard
			$isDragging={isDragging}
			size="small"
			title={
				<BaseTooltip overlay={item.title}>
					{/* styled(Typography.Title) throws an error in console about 
          forwarding ref in function components.
          Because Typography.Title doesn't accept a ref.
          So, we just placed a span tag here. */}
					<span>
						<TaskboardItemCardTitle
							level={5}
							ellipsis={{ rows: 2 }}
						>
							{item.title}
						</TaskboardItemCardTitle>
					</span>
				</BaseTooltip>
			}
			// extra={
			// 	<Dropdown
			// 		overlay={
			// 			<Menu>
			// 				<Menu.Item
			// 					icon={<EditOutlined />}
			// 					onClick={() => onEdit(item)}
			// 				>
			// 					Edit
			// 				</Menu.Item>
			// 				<DeleteMenuItem
			// 					icon={<DeleteOutlined />}
			// 					onClick={() =>
			// 						Modal.confirm({
			// 							title: 'Delete?',
			// 							content: `Are you sure to delete "${item.title}"?`,
			// 							onOk: () =>
			// 								onDelete({
			// 									status,
			// 									itemToDelete: item,
			// 								}),
			// 						})
			// 					}
			// 				>
			// 					Delete
			// 				</DeleteMenuItem>
			// 			</Menu>
			// 		}
			// 		trigger={['click']}
			// 	>
			// 		<Button size="small" icon={<MoreOutlined />} />
			// 	</Dropdown>
			// }
		>
			<div className="avatar-container">
				<Avatar
					src={item.profileImg ? <Image src={item.profileImg} /> : ''}
					icon={item.profileImg ? '' : <UserOutlined />}
					size={60}
				/>
			</div>
			<div className="card-content-container">
				<Typography.Title level={5}>{item.name}</Typography.Title>
				<Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
					{item.description}
				</Typography.Paragraph>
			</div>
		</StyledCard>
	);
}

export default TaskboardItemCard;
