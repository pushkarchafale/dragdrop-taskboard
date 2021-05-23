export interface TaskboardItem {
  _id: string;
  name: string;
  description: string;
  title: string;
  status: string;
  profileImg?: string;
}

export enum TaskboardItemStatus {
  APPLICANTS = 'Applicants',
  UNDER_REVIEW = 'Under Review',
  SELECTED = 'Selected',
  REJECTED = 'Rejected',
}
