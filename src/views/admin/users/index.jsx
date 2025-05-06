import { Boundary } from '@/components/common';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import UserNavbar from '../components/Users/UserNavbar';

const Users = () => {
  useDocumentTitle('Product List | Ayounek Admin');
  useScrollTop();

  const store = useSelector((state) => ({
    users: state.users || { items: [], total: 0 }, // Provide default values
  }));

  const isLoading = !store.users.items; // Check if users data is still loading

  return (
    <Boundary>
      {isLoading ? (
        <div>Loading users...</div> // Show a loading message while data is being fetched
      ) : (
        <>
          <UserNavbar
            usersCount={store.users.items.length || 0}
            totalUsersCount={store.users.total || 0}
          />
          <div className="product-admin-items">
            {/* Render user items here */}
          </div>
        </>
      )}
    </Boundary>
  );
};

export default Users;