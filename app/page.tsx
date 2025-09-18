'use client';

import { useEffect } from 'react';
import { User, Screen } from '@/types';
import { useStore } from '@/store/useStore';
import LoginScreen from '@/components/LoginScreen';
import EnhancedManagerDashboard from '@/components/EnhancedManagerDashboard';
import EnhancedTechnicianWorkspace from '@/components/EnhancedTechnicianWorkspace';
import InspectorDashboard from '@/components/InspectorDashboard';
import { notificationSystem } from '@/utils/notificationSystem';
import IncomingPartRegistration from '@/components/IncomingPartRegistration';
export default function Home() {
  const { 
    currentUser, 
    currentScreen, 
    parts, 
    technicians, 
    setCurrentUser, 
    setCurrentScreen
  } = useStore();

  // Initialize notification system
  useEffect(() => {
    // Run initial checks
    notificationSystem.runAllChecks(parts, technicians);
    
    // Start periodic checks every 30 minutes
    notificationSystem.startPeriodicChecks(parts, technicians, 30);
  }, [parts, technicians]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'manager') {
      setCurrentScreen('manager-dashboard');
    } else if (user.role === 'technician') {
      setCurrentScreen('technician-workspace');
    } else if (user.role === 'inspector') {
      setCurrentScreen('inspector-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'manager-dashboard' && currentUser && currentUser.role === 'manager' && (
        <EnhancedManagerDashboard
          manager={currentUser}
          onLogout={handleLogout}
          onRegisterPart={() => handleNavigate('incoming-part-registration')}
        />
      )}
      {currentScreen === 'technician-workspace' && currentUser && currentUser.role === 'technician' && (
        <EnhancedTechnicianWorkspace
          technician={currentUser}
          onLogout={handleLogout}
          onRegisterPart={() => handleNavigate('incoming-part-registration')}
        />
      )}
      {currentScreen === 'inspector-dashboard' && currentUser && currentUser.role === 'inspector' && (
        <InspectorDashboard
          inspector={currentUser}
          parts={parts}
          onLogout={handleLogout}
          onRegisterPart={() => handleNavigate('incoming-part-registration')}
          onUpdatePart={useStore.getState().updatePart}
        />
      )}
      {currentScreen === 'incoming-part-registration' && (
        <IncomingPartRegistration onHome={handleLogout} />
      )}
    </div>
  );
}
