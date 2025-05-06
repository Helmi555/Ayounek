/* eslint-disable react/forbid-prop-types */
import PropType from 'prop-types';
import React from 'react';
import { UserItem } from './UserItem'; // Create similar UserItem component

const UsersTable = ({ filteredUsers }) => (
  <div>
    {filteredUsers.length > 0 && (
      <div className="grid grid-user grid-count-6">
        <div className="grid-col">
          <h5>Avatar</h5>
        </div>
        <div className="grid-col">
          <h5>Email</h5>
        </div>
        <div className="grid-col">
          <h5>Full Name</h5>
        </div>
        <div className="grid-col">
          <h5>Date Joined</h5>
        </div>
        <div className="grid-col">
          <h5>Mobile</h5>
        </div>
        <div className="grid-col">
          <h5>Role</h5> {/* Add role to your user model if needed */}
        </div>
      </div>
    )}
    {filteredUsers.length === 0 ? 
      new Array(10).fill({}).map((user, index) => (
        <UserItem
          key={`user-skeleton ${index}`}
          user={user}
        />
      )) : 
      filteredUsers.map((user) => (
        <UserItem
          key={user.email}
          user={user}
        />
      ))}
  </div>
);

UsersTable.propTypes = {
  filteredUsers: PropType.array.isRequired
};

export default UsersTable;