'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Task, TechnologyLayer, TaskStatus } from '@/lib/types';
import { generateTaskId, calculateDaysTaken } from '@/lib/utils';
import { useTaskStore } from '@/lib/store';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function NewTaskModal({ isOpen, onClose, onSave }: NewTaskModalProps) {
  const { projectNames, addProjectName, technologyLayers, addTechnologyLayer, userNames, addUserName } = useTaskStore();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    technologyLayer: 'Python' as TechnologyLayer,
    status: 'To Do' as TaskStatus,
    dateStarted: '',
    dateEnded: '',
    userName: '',
  });
  const [showCustomProject, setShowCustomProject] = useState(false);
  const [customProjectName, setCustomProjectName] = useState('');
  const [showCustomTech, setShowCustomTech] = useState(false);
  const [customTechLayer, setCustomTechLayer] = useState('');
  const [showCustomUser, setShowCustomUser] = useState(false);
  const [customUserName, setCustomUserName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const projectName = showCustomProject ? customProjectName : formData.projectName;
    const userName = showCustomUser ? customUserName : formData.userName;
    if (!projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dateStarted) newErrors.dateStarted = 'Start date is required';
    if (!userName.trim()) newErrors.userName = 'User name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const projectName = showCustomProject ? customProjectName : formData.projectName;
    const technologyLayer = showCustomTech ? customTechLayer : formData.technologyLayer;
    const userName = showCustomUser ? customUserName : formData.userName;
    
    if (showCustomProject && customProjectName.trim()) {
      addProjectName(customProjectName.trim());
    }
    
    if (showCustomTech && customTechLayer.trim()) {
      addTechnologyLayer(customTechLayer.trim());
    }
    
    if (showCustomUser && customUserName.trim()) {
      addUserName(customUserName.trim());
    }

    const daysTaken = calculateDaysTaken(formData.dateStarted, formData.dateEnded);
    const newTask: Task = {
      id: generateTaskId(),
      ...formData,
      projectName,
      technologyLayer,
      userName,
      daysTaken,
    };

    onSave(newTask);
    setFormData({
      projectName: '',
      description: '',
      technologyLayer: 'Python',
      status: 'To Do',
      dateStarted: '',
      dateEnded: '',
      userName: '',
    });
    setShowCustomProject(false);
    setCustomProjectName('');
    setShowCustomTech(false);
    setCustomTechLayer('');
    setShowCustomUser(false);
    setCustomUserName('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            {!showCustomProject ? (
              <div className="space-y-2">
                <select
                  value={formData.projectName}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setShowCustomProject(true);
                      setFormData({ ...formData, projectName: '' });
                    } else {
                      setFormData({ ...formData, projectName: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {projectNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="__custom__">+ Add New Project</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    placeholder="Enter new project name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomProject(false);
                      setCustomProjectName('');
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technology Layer</label>
              {!showCustomTech ? (
                <select
                  value={formData.technologyLayer}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setShowCustomTech(true);
                      setFormData({ ...formData, technologyLayer: 'Python' });
                    } else {
                      setFormData({ ...formData, technologyLayer: e.target.value as TechnologyLayer });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {technologyLayers.map((tech) => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                  <option value="__custom__">+ Add New Technology</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTechLayer}
                    onChange={(e) => setCustomTechLayer(e.target.value)}
                    placeholder="Enter new technology"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomTech(false);
                      setCustomTechLayer('');
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              {!showCustomUser ? (
                <select
                  value={formData.userName}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setShowCustomUser(true);
                      setFormData({ ...formData, userName: '' });
                    } else {
                      setFormData({ ...formData, userName: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  {userNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="__custom__">+ Add New User</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUserName}
                    onChange={(e) => setCustomUserName(e.target.value)}
                    placeholder="Enter new user name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomUser(false);
                      setCustomUserName('');
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Validation">In Validation</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Started</label>
              <input
                type="date"
                value={formData.dateStarted}
                onChange={(e) => setFormData({ ...formData, dateStarted: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dateStarted && <p className="text-red-500 text-sm mt-1">{errors.dateStarted}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Ended</label>
              <input
                type="date"
                value={formData.dateEnded}
                onChange={(e) => setFormData({ ...formData, dateEnded: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {formData.dateStarted && formData.dateEnded && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Days Taken (excluding weekends):</span>{' '}
                <span className="text-lg font-bold">{calculateDaysTaken(formData.dateStarted, formData.dateEnded)}</span> business days
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
