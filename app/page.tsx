'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskStore } from '@/lib/store';
import { TaskStatus, TechnologyLayer } from '@/lib/types';
import DataTable from '@/components/DataTable';
import NewTaskModal from '@/components/NewTaskModal';
import { exportToCSV, filterTasksByMonth } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function Home() {
  const { tasks, addTask, updateTask, deleteTask, fetchTasks, fetchMetadata, loading, projectNames, technologyLayers, userNames } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMetadata();
    fetchTasks();
  }, []);

  // reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMonth, statusFilter, techFilter, projectFilter, userFilter]);

  if (!mounted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = !selectedMonth || filterTasksByMonth([task], selectedMonth).length > 0;
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesTech = !techFilter || task.technologyLayer === techFilter;
    const matchesProject = !projectFilter || task.projectName === projectFilter;
    const matchesUser = !userFilter || task.userName === userFilter;
    return matchesSearch && matchesMonth && matchesStatus && matchesTech && matchesProject && matchesUser;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const uniqueUsers = Array.from(new Set(tasks.map(t => t.userName).filter(Boolean)));

  const selectClass = "px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">Task Tracker</h1>
          <p className="text-gray-500">Enterprise Project Management Dashboard</p>
        </div>

        {/* Top bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by task name, ID or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={selectClass}
              />
              <button onClick={() => { const m = selectedMonth ? selectedMonth : 'all'; exportToCSV(filteredTasks, `tasks-${m}.csv`); }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                <Download size={16} /> Export CSV
              </button>
              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                <Plus size={16} /> New Task
              </button>
            </div>
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-600">Filters:</span>

            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={selectClass}>
              <option value="">All Projects</option>
              {projectNames.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="">All Statuses</option>
              {(['To Do', 'In Progress', 'In Validation', 'Completed'] as TaskStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={techFilter} onChange={(e) => setTechFilter(e.target.value)} className={selectClass}>
              <option value="">All Technologies</option>
              {technologyLayers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className={selectClass}>
              <option value="">All Users</option>
              {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
            </select>

            {(projectFilter || statusFilter || techFilter || userFilter || selectedMonth || searchQuery) && (
              <button
                onClick={() => { setProjectFilter(''); setStatusFilter(''); setTechFilter(''); setUserFilter(''); setSelectedMonth(''); setSearchQuery(''); }}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading tasks...</div>
          ) : (
            <DataTable tasks={paginatedTasks} onUpdate={updateTask} onDelete={deleteTask} />
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredTasks.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredTasks.length)}–{Math.min(currentPage * PAGE_SIZE, filteredTasks.length)} of {filteredTasks.length} tasks
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm border ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addTask} />
    </div>
  );
}
