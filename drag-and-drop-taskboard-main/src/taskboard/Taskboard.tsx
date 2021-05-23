import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { useContext, useEffect, useMemo, useState } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemFormModal, {
  TaskboardItemFormValues,
} from './TaskboardItemFormModal';
import TaskboardCol, { TaskboardColProps } from './TaskboardCol';
import { useSyncedState } from '../shared/SharedHooks';
import { goTry } from 'go-try';
import axios from 'axios';
import AppContext from '../shared/AppContext';

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  min-width: 800px;
  max-width: 1400px;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
`;

interface ApplicantList {
  users: TaskboardItem[];
}

const defaultItems = {
  [TaskboardItemStatus.APPLICANTS]: [],
  [TaskboardItemStatus.UNDER_REVIEW]: [],
  [TaskboardItemStatus.SELECTED]: [],
  [TaskboardItemStatus.REJECTED]: [],
};

type TaskboardData = Record<TaskboardItemStatus, TaskboardItem[]>;

function Taskboard() {
  let appContext = useContext(AppContext);
  const [itemsByStatus, setItemsByStatus] = useSyncedState<TaskboardData>(
    'itemsByStatus',
    defaultItems,
    true
  );

  /*const [displayItems, setDisplayItems] = useState(items);

  useEffect(() => {
    setDisplayItems(
      items.filter((item) => {
        return appContext.filteredJobTitles.length > 0
          ? appContext.filteredJobTitles.indexOf(item.title) > -1
          : true;
      })
    );
  }, [appContext.filteredJobTitles, items]);*/

  useEffect(() => {
    (async () => {
      if (appContext.isLoggedIn) {
        appContext.setIsLoading(true);
        let res = await goTry(() =>
          axios.get<ApplicantList>('http://ayrataskdemo.eu-west-1.elasticbeanstalk.com/api')
        );
        if (res.error) {
          return;
        }
        setItemsByStatus((current) =>
          produce(current, (draft) => {
            let jobTitles: string[] = [];

            (res.data?.data as ApplicantList | null)?.users?.forEach(
              (applicant: TaskboardItem) => {
                draft[applicant.status as TaskboardItemStatus].push(applicant);
                if (jobTitles.indexOf(applicant.title) === -1) {
                  jobTitles.push(applicant.title);
                }
              }
            );
            appContext.setAllJobTitles(jobTitles);
            appContext.setIsLoading(false);
          })
        );
      } else {
        setItemsByStatus((current) =>
          produce(current, (draft) => {
            Object.values(TaskboardItemStatus).forEach(
              (x: TaskboardItemStatus) => {
                draft[x as TaskboardItemStatus] = [];
              }
            );
            appContext.setAllJobTitles([] as string[]);
            appContext.setIsLoading(false);
          })
        );
      }
    })();
  }, [appContext.isLoggedIn, setItemsByStatus]);

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({
    source,
    destination,
  }) => {
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        // dropped outside the list
        if (!destination) {
          return;
        }
        const [removed] = draft[
          source.droppableId as TaskboardItemStatus
        ].splice(source.index, 1);
        removed.status = destination.droppableId;
        draft[destination.droppableId as TaskboardItemStatus].splice(
          destination.index,
          0,
          removed
        );

        goTry(() =>
          axios.post('http://ayrataskdemo.eu-west-1.elasticbeanstalk.com/api/update-status', removed)
        ).then((result) => {
          if (result.error) {
            // eslint-disable-next-line no-console
            console.log('status update failed');
          } else {
            // eslint-disable-next-line no-console
            console.log('status update successfull');
          }
        });
      })
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<TaskboardItem | null>(null);

  const openTaskItemModal = (itemToEdit: TaskboardItem | null) => {
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
  };

  const handleDelete: TaskboardColProps['onDelete'] = ({
    status,
    itemToDelete,
  }) =>
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item._id !== itemToDelete._id
        );
      })
    );

  const initialValues = useMemo<TaskboardItemFormValues>(
    () => ({
      title: itemToEdit?.title ?? '',
      description: itemToEdit?.description ?? '',
      name: itemToEdit?.name ?? '',
      status: itemToEdit?.status ?? '',
    }),
    [itemToEdit]
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskboardRoot>
          <TaskboardContent>
            {Object.values(TaskboardItemStatus).map((status) => (
              <TaskboardCol
                key={status}
                status={status}
                items={itemsByStatus[status].filter((item) => {
                  return appContext.filteredJobTitles.length > 0
                    ? appContext.filteredJobTitles.indexOf(item.title) > -1
                    : true;
                })}
                onClickAdd={
                  status === TaskboardItemStatus.APPLICANTS
                    ? () => openTaskItemModal(null)
                    : undefined
                }
                onEdit={openTaskItemModal}
                onDelete={handleDelete}
              />
            ))}
          </TaskboardContent>
        </TaskboardRoot>
      </DragDropContext>
      <TaskboardItemFormModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current) =>
            produce(current, (draft) => {
              if (itemToEdit) {
                // Editing existing item
                const draftItem = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item) => item._id === itemToEdit._id);
                if (draftItem) {
                  draftItem.title = values.title;
                  draftItem.description = values.description;
                  draftItem.name = values.name;
                }
              } else {
                // Adding new item as "to do"
                draft[TaskboardItemStatus.APPLICANTS].push({
                  ...values,
                  status: TaskboardItemStatus.APPLICANTS,
                });
              }

              let jobTitles = [...appContext.allJobTitles];

              if (jobTitles.indexOf(values.title) === -1) {
                jobTitles.push(values.title);
                appContext.setAllJobTitles(jobTitles as string[]);
              }
            })
          );
        }}
        initialValues={initialValues}
      />
    </>
  );
}

export default Taskboard;
