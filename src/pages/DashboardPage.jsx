import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ProjectForm from '../components/ProjectForm';
import PendingProjectsList from '../components/PendingProjectsList';
import MyProjectsList from '../components/MyProjectsList';
import UserList from '../components/UserList';
import AdminAnalytics from '../components/AdminAnalytics';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  // A more robust check: Ensure the user object is fully loaded with a name and role
  // before attempting to render anything that depends on it.
  if (!user || !user.name || !user.role) return null;

  return (
    <div>
      <h2>Welcome to your dashboard, {user.name}!</h2>

      {user.role === 'student' && (
        <>
          <MyProjectsList />
          <hr />
          <p>You can submit a new project for review below.</p>
          <ProjectForm />
        </>
      )}

      {user.role === 'supervisor' && (
        <>
          <p>As a supervisor, you can review pending projects below.</p>
          <PendingProjectsList />
        </>
      )}

      {user.role === 'admin' && (
        <>
          <p>As an administrator, you can manage users and view system analytics.</p>
          <AdminAnalytics />
          <hr />
          <UserList />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
