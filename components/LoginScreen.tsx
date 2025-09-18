'use client';

import { useState } from 'react';
import { User } from '@/types';
// --- START: Import inspectors ---
import { technicians, managers, inspectors } from '@/data/enhancedMockData';
// --- END: Import inspectors ---
import { UserCheck, Wrench, Users } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  // --- START: Add inspector to type ---
  const [selectedRole, setSelectedRole] = useState<'manager' | 'technician' | 'inspector' | null>(null);
  // --- END: Add inspector to type ---
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // --- START: Update handleRoleSelect ---
  const handleRoleSelect = (role: 'manager' | 'technician' | 'inspector') => {
    setSelectedRole(role);
    setSelectedUser(null);
  };
  // --- END: Update handleRoleSelect ---

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleLogin = () => {
    if (selectedUser) {
      onLogin(selectedUser);
    }
  };

  // --- START: Add inspector role option ---
  const roleOptions = [
    { key: 'manager', label: 'Manager', icon: <Users className="w-6 h-6 text-primary-600" />, description: 'View dashboard and assign parts' },
    { key: 'technician', label: 'Technician', icon: <Wrench className="w-6 h-6 text-warning-600" />, description: 'Work on assigned parts' },
    { key: 'inspector', label: 'Inspector', icon: <UserCheck className="w-6 h-6 text-green-600" />, description: 'Inspect and approve repaired parts' },
  ];
  // --- END: Add inspector role option ---

  // --- START: Update getUsersForRole ---
  const getUsersForRole = () => {
    if (selectedRole === 'manager') return managers;
    if (selectedRole === 'technician') return technicians;
    if (selectedRole === 'inspector') return inspectors;
    return [];
  };
  // --- END: Update getUsersForRole ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Repair Shop Management</h1>
          <p className="text-gray-600">Select your role and user account to continue</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Role Selection - Centered and only visible if no role selected */}
          {!selectedRole && (
            <div className="card w-full max-w-md mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                <UserCheck className="w-5 h-5 mr-2 text-primary-600" />
                Select Role
              </h2>
              <div className="space-y-4">
                {roleOptions.map((role) => (
                  <button
                    key={role.key}
                    onClick={() => handleRoleSelect(role.key as 'manager' | 'technician' | 'inspector')}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedRole === role.key
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        {role.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Selection - Only visible after role is selected */}
          {selectedRole && (
            <div className="card w-full max-w-md mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                Select User
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getUsersForRole().map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedUser?.id === user.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Login Button */}
        {selectedUser && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLogin}
              className="btn-primary px-8 py-3 text-lg"
            >
              Login as {selectedUser.name}
            </button>
          </div>
        )}

        {/* Selected User Preview */}
        {selectedUser && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-white rounded-lg p-4 shadow-sm border">
              <img
                src={selectedUser.photo}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="text-left">
                <p className="font-medium text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-600 capitalize">{selectedUser.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}