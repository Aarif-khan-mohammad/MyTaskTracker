import { Task } from './types';

export const calculateDaysTaken = (dateStarted: string, dateEnded: string): number => {
  if (!dateStarted || !dateEnded) return 0;
  const start = new Date(dateStarted);
  const end = new Date(dateEnded);
  
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const generateTaskId = (): string => {
  return `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const exportToCSV = (tasks: Task[], filename: string) => {
  const headers = ['Task ID', 'Project Name', 'Description', 'Technology Layer', 'Status', 'Date Started', 'Date Ended', 'Days Taken'];
  const rows = tasks.map(task => [
    task.id,
    task.projectName,
    task.description,
    task.technologyLayer,
    task.status,
    task.dateStarted,
    task.dateEnded,
    task.daysTaken.toString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const filterTasksByMonth = (tasks: Task[], month: string): Task[] => {
  if (!month) return tasks;
  return tasks.filter(task => {
    const taskMonth = task.dateStarted.substring(0, 7);
    return taskMonth === month;
  });
};
