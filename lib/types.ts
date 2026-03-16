export type TechnologyLayer = 'Python' | 'UI' | 'BFF' | string;
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'In Validation';

export interface Task {
  id: string;
  projectName: string;
  description: string;
  technologyLayer: TechnologyLayer;
  status: TaskStatus;
  dateStarted: string;
  dateEnded: string;
  daysTaken: number;
  userName: string;
}
