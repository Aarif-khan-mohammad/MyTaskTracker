export type TechnologyLayer = 'Python' | 'UI' | 'BFF';
export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Completed';

export interface Task {
  id: string;
  projectName: string;
  description: string;
  technologyLayer: TechnologyLayer;
  status: TaskStatus;
  dateStarted: string;
  dateEnded: string;
  daysTaken: number;
}
