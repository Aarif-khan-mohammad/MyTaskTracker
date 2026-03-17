import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from './types';
import { getSupabase } from './supabase';

interface TaskStore {
  tasks: Task[];
  projectNames: string[];
  technologyLayers: string[];
  userNames: string[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addProjectName: (name: string) => void;
  addTechnologyLayer: (tech: string) => void;
  addUserName: (name: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      projectNames: ['Elevance', 'CollabOps', 'Ardgha Glass', 'Others'],
      technologyLayers: ['Python', 'UI', 'BFF'],
      userNames: ['Aarif', 'Geethika'],
      loading: false,

      fetchTasks: async () => {
        set({ loading: true });
        try {
          const { data, error } = await getSupabase()
            .from('tasks')
            .select('*')
            .order('createdAt', { ascending: false });
          if (error) {
            console.error('Supabase fetch error:', error.message);
          } else if (data) {
            set({ tasks: data as Task[] });
          }
        } catch (e) {
          console.error('fetchTasks error:', e);
        } finally {
          set({ loading: false });
        }
      },

      addTask: async (task) => {
        const { error } = await getSupabase().from('tasks').insert([task]);
        if (!error) set((state) => ({ tasks: [task, ...state.tasks] }));
      },

      updateTask: async (id, updatedTask) => {
        const { error } = await getSupabase().from('tasks').update(updatedTask).eq('id', id);
        if (!error) set((state) => ({
          tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updatedTask } : t),
        }));
      },

      deleteTask: async (id) => {
        const { error } = await getSupabase().from('tasks').delete().eq('id', id);
        if (!error) set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      addProjectName: (name) => set((state) => {
        if (!state.projectNames.includes(name)) {
          return { projectNames: [...state.projectNames, name] };
        }
        return state;
      }),

      addTechnologyLayer: (tech) => set((state) => {
        if (!state.technologyLayers.includes(tech)) {
          return { technologyLayers: [...state.technologyLayers, tech] };
        }
        return state;
      }),

      addUserName: (name) => set((state) => {
        if (!state.userNames.includes(name)) {
          return { userNames: [...state.userNames, name] };
        }
        return state;
      }),
    }),
    {
      name: 'task-meta-storage',
      partialize: (state) => ({
        projectNames: state.projectNames,
        technologyLayers: state.technologyLayers,
        userNames: state.userNames,
      }),
    }
  )
);
