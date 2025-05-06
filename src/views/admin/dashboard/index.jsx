import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import Stats from './Stats';


const Dashboard = () => {
  useDocumentTitle('Welcome | Admin Dashboard');
  useScrollTop();

  return (
    <div className="loader">
      <h2>Welcome to admin dashboard</h2>
    </div>
  );
};

export default Dashboard;
