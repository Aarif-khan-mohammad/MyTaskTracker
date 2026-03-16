'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Download, Filter } from 'lucide-react';
import { useTaskStore } from '@/lib/store';
import { Task, TaskStatus, TechnologyLayer } from '@/lib/types';
import DataTable from '@/components/DataTable';
import NewTaskModal from '@/components/NewTaskModal';
import { exportToCSV, filterTasksByMonth } from '@/lib/utils';

export default function Home() {
  const { tasks, addTask, updateTask, deleteTask, fetchTasks, loading } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);
  const [techFilter, setTechFilter] = useState<TechnologyLayer[]>([]);
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = !selectedMonth || filterTasksByMonth([task], selectedMonth).length > 0;
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    const matchesTech = techFilter.length === 0 || techFilter.includes(task.technologyLayer);
    const matchesUser = userFilter.length === 0 || userFilter.includes(task.userName);
    
    return matchesSearch && matchesMonth && matchesStatus && matchesTech && matchesUser;
  });

  const handleExport = () => {
    const monthName = selectedMonth ? selectedMonth : 'all';
    exportToCSV(filteredTasks, `tasks-${monthName}.csv`);
  };

  const toggleStatusFilter = (status: TaskStatus) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleTechFilter = (tech: TechnologyLayer) => {
    setTechFilter(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleUserFilter = (user: string) => {
    setUserFilter(prev =>
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
  };

  const uniqueUsers = Array.from(new Set(tasks.map(task => task.userName).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Tracker</h1>
          <p className="text-gray-600">Enterprise Project Management Dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download size={20} />
                Export CSV
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {(['To Do', 'In Progress', 'In Validation', 'Completed'] as TaskStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    statusFilter.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tech:</span>
              {(['Python', 'UI', 'BFF'] as TechnologyLayer[]).map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechFilter(tech)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    techFilter.includes(tech)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>

            {uniqueUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">User:</span>
                {uniqueUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => toggleUserFilter(user)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      userFilter.includes(user)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-2">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading tasks...</div>
          ) : (
            <DataTable tasks={filteredTasks} onUpdate={updateTask} onDelete={deleteTask} />
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTask}
      />
    </div>
  );
}
