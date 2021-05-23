import {
  Droppable,
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  DropAnimation,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Button, Card } from 'antd';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemCard, { TaskboardItemCardProps } from './TaskboardItemCard';
import { colors } from '../shared/SharedUtils';
import { CheckOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import AppContext from '../shared/AppContext';

const TaskboardColRoot = styled(Card)`
  user-select: none;
  flex: 1;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  // To force each flex item to have equal width
  // even if they have long texts with no spaces etc.
  min-width: 0;
  > .ant-card-body {
    overflow: hidden;
    height: 100%;
    padding: 0;
  }
  > .ant-card-head {
    background-color: ${colors.columnDragOver};
  }
  .ant-card-extra {
    padding: 0px;
  }
  .task-title {
    color: ${colors.columnTitleColor};
    font-weight: bold;
  }
  .item-count {
    background-color: ${colors.columnCountBg};
    padding: 0px 5px;
    border-radius: 5px;
    color: #fff;
  }
`;

interface DroppableRootProps {
  isDraggingOver: boolean;
}

const DroppableRoot = styled.div<DroppableRootProps>`
  height: 100%;
  overflow-y: auto;
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? colors.columnDragStart : colors.columnDragOver};
`;

export type TaskboardColProps = Pick<
  TaskboardItemCardProps,
  'onEdit' | 'onDelete'
> & {
  items: TaskboardItem[];
  status: TaskboardItemStatus;
  onClickAdd?: VoidFunction;
};

function getStyle(style: DraggingStyle, snapshot: DraggableStateSnapshot) {
  /*if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };*/
  if (!snapshot.isDropAnimating) {
    return style;
  }
  const { moveTo, curve, duration } = snapshot.dropAnimation as DropAnimation;
  // move to the right spot
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  // add a bit of turn for fun
  const rotate = 'rotate(-10deg)';

  // patching the existing style
  return {
    ...style,
    transform: `${translate} ${rotate}`,
    // slowing down the drop because we can
    transition: `all ${curve} ${duration}s`,
  };
}

function TaskboardCol({
  items,
  status,
  onClickAdd,
  onEdit,
  onDelete,
}: TaskboardColProps) {

  let appContext = useContext(AppContext);

  return (
    <TaskboardColRoot
      title={
        <span className="task-title">
          <CheckOutlined style={{ fontWeight: 'bold' }} /> {status}{' '}
          {items.length ? (
            <span className="item-count">{items.length}</span>
          ) : (
            ''
          )}
        </span>
      }
      extra={
        onClickAdd && (
          <Button type="primary" onClick={onClickAdd} disabled={!appContext.isLoggedIn}>
            Add Applicant
          </Button>
        )
      }
    >
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <DroppableRoot
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {items.map((item, index) => {
              return (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      key={item._id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getStyle(
                        provided.draggableProps.style as DraggingStyle,
                        snapshot
                      )}
                    >
                      <TaskboardItemCard
                        item={item}
                        status={status}
                        isDragging={snapshot.isDragging}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </DroppableRoot>
        )}
      </Droppable>
    </TaskboardColRoot>
  );
}

export default TaskboardCol;
