'use client';

import { Task, TaskStatus, TechnologyLayer } from '@/lib/types';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { calculateDaysTaken } from '@/lib/utils';

interface DataTableProps {
  tasks: Task[];
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function DataTable({ tasks, onUpdate, onDelete }: DataTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      case 'To Do': return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditData(task);
  };

  const handleSave = () => {
    if (!editingId) return;
    
    let updatedData = { ...editData };
    
    if (updatedData.status === 'Completed' && !updatedData.dateEnded) {
      updatedData.dateEnded = new Date().toISOString().split('T')[0];
    }
    
    if (updatedData.dateStarted && updatedData.dateEnded) {
      updatedData.daysTaken = calculateDaysTaken(updatedData.dateStarted, updatedData.dateEnded);
    }
    
    onUpdate(editingId, updatedData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Task ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tech Layer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Started</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Ended</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Days</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50">
              {editingId === task.id ? (
                <>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.id}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editData.projectName || ''}
                      onChange={(e) => setEditData({ ...editData, projectName: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editData.technologyLayer || ''}
                      onChange={(e) => setEditData({ ...editData, technologyLayer: e.target.value as TechnologyLayer })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="Python">Python</option>
                      <option value="UI">UI</option>
                      <option value="BFF">BFF</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editData.status || ''}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={editData.dateStarted || ''}
                      onChange={(e) => setEditData({ ...editData, dateStarted: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={editData.dateEnded || ''}
                      onChange={(e) => setEditData({ ...editData, dateEnded: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.daysTaken}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Check size={18} />
                      </button>
                      <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{task.projectName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.technologyLayer}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.dateStarted}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.dateEnded || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-semibold">{task.daysTaken}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(task)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks found. Create your first task to get started.
        </div>
      )}
    </div>
  );
}
