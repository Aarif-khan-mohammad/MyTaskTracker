'use client';

import { Task, TaskStatus, TechnologyLayer } from '@/lib/types';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { calculateDaysTaken } from '@/lib/utils';
import { useTaskStore } from '@/lib/store';

interface DataTableProps {
  tasks: Task[];
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function DataTable({ tasks, onUpdate, onDelete }: DataTableProps) {
  const { projectNames, addProjectName, technologyLayers, addTechnologyLayer, userNames, addUserName } = useTaskStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [showCustomProject, setShowCustomProject] = useState(false);
  const [customProjectName, setCustomProjectName] = useState('');
  const [showCustomTech, setShowCustomTech] = useState(false);
  const [customTechLayer, setCustomTechLayer] = useState('');
  const [showCustomUser, setShowCustomUser] = useState(false);
  const [customUserName, setCustomUserName] = useState('');

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'In Validation': return 'bg-yellow-100 text-yellow-800';
      case 'To Do': return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditData(task);
    setShowCustomProject(false);
    setCustomProjectName('');
    setShowCustomTech(false);
    setCustomTechLayer('');
    setShowCustomUser(false);
    setCustomUserName('');
  };

  const handleSave = async () => {
    if (!editingId) return;
    let updatedData = { ...editData };
    if (showCustomProject && customProjectName.trim()) {
      await addProjectName(customProjectName.trim());
      updatedData.projectName = customProjectName.trim();
    }
    if (showCustomTech && customTechLayer.trim()) {
      await addTechnologyLayer(customTechLayer.trim());
      updatedData.technologyLayer = customTechLayer.trim();
    }
    if (showCustomUser && customUserName.trim()) {
      await addUserName(customUserName.trim());
      updatedData.userName = customUserName.trim();
    }
    if (updatedData.status === 'Completed' && !updatedData.dateEnded) {
      updatedData.dateEnded = new Date().toISOString().split('T')[0];
    }
    if (updatedData.dateStarted && updatedData.dateEnded) {
      updatedData.daysTaken = calculateDaysTaken(updatedData.dateStarted, updatedData.dateEnded);
    }
    onUpdate(editingId, updatedData);
    setEditingId(null); setEditData({});
    setShowCustomProject(false); setCustomProjectName('');
    setShowCustomTech(false); setCustomTechLayer('');
    setShowCustomUser(false); setCustomUserName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setShowCustomProject(false);
    setCustomProjectName('');
    setShowCustomTech(false);
    setCustomTechLayer('');
    setShowCustomUser(false);
    setCustomUserName('');
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
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User Name</th>
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
                    {!showCustomProject ? (
                      <select
                        value={editData.projectName || ''}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setShowCustomProject(true);
                            setCustomProjectName('');
                          } else {
                            setEditData({ ...editData, projectName: e.target.value });
                          }
                        }}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Select project</option>
                        {projectNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                        <option value="__custom__">+ Add New</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customProjectName}
                        onChange={(e) => setCustomProjectName(e.target.value)}
                        placeholder="New project name"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    )}
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
                    {!showCustomTech ? (
                      <select
                        value={editData.technologyLayer || ''}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setShowCustomTech(true);
                            setCustomTechLayer('');
                          } else {
                            setEditData({ ...editData, technologyLayer: e.target.value as TechnologyLayer });
                          }
                        }}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        {technologyLayers.map((tech) => (
                          <option key={tech} value={tech}>{tech}</option>
                        ))}
                        <option value="__custom__">+ Add New</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customTechLayer}
                        onChange={(e) => setCustomTechLayer(e.target.value)}
                        placeholder="New technology"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!showCustomUser ? (
                      <select
                        value={editData.userName || ''}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setShowCustomUser(true);
                            setCustomUserName('');
                          } else {
                            setEditData({ ...editData, userName: e.target.value });
                          }
                        }}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Select user</option>
                        {userNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                        <option value="__custom__">+ Add New</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customUserName}
                        onChange={(e) => setCustomUserName(e.target.value)}
                        placeholder="New user name"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editData.status || ''}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Validation">In Validation</option>
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
                  <td className="px-4 py-3 text-sm text-gray-600">{task.userName}</td>
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
