import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from './types';

interface TaskStore {
  tasks: Task[];
  projectNames: string[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProjectName: (name: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      projectNames: ['Elevance', 'CollabOps', 'Ardgha Glass', 'Others'],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),
      addProjectName: (name) => set((state) => {
        if (!state.projectNames.includes(name)) {
          return { projectNames: [...state.projectNames, name] };
        }
        return state;
      }),
    }),
    {
      name: 'task-storage',
    }
  )
);
