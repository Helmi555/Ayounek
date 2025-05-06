import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import Stats from './Stats';


const Dashboard = () => {
  useDocumentTitle('Welcome | Admin Dashboard');
  useScrollTop();

  return (
    <div className="loader">
      <h2>Welcome to admin dashboard</h2>
      <Stats/>
    </div>
  );
};

export default Dashboard;
