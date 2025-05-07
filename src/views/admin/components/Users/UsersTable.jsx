/* eslint-disable react/forbid-prop-types */
import PropType from 'prop-types';
import React from 'react';
import UserItem from './UserItem';

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const UsersTable = ({ filteredUsers }) => (
  <div style={{ 
    fontFamily:"Tajawal, Helvetica, Arial, sans-serif", 
    maxWidth: '1200px', 
    margin: '0 auto',
    '--hover-color': '#f5f5f5' // CSS variable for hover
  }}>
    {/* Table Header - Lighter font weight */}
    {filteredUsers.length > 0 && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px minmax(200px, 2fr) minmax(150px, 1.5fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(120px, 1fr)',
        gap: '16px',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '16px 0',
        fontWeight: 'bold', // Changed from 600 to 500
        fontSize: '14px',
        color: '#1a1a1a', // Softer text color
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ justifySelf: 'center' }}>Avatar</div>
        <div style={{ paddingLeft: '8px' }}>Email</div>
        <div>Full Name</div>
        <div>Location</div>
        <div style={{ textAlign: 'center' }}>Date Joined</div>
        <div style={{ textAlign: 'right' }}>Mobile</div>
      </div>
    )}

    {/* Table Rows */}
    {filteredUsers.length === 0 ? 
      new Array(10).fill({}).map((_, index) => (
        <UserItem key={`user-skeleton-${index}`} skeleton />
      )) : 
      filteredUsers.map((user) => (
        <UserItem 
          key={user.email}
          user={{
            ...user,
            dateJoined: formatDate(user.dateJoined),
            mobile: user.mobile?.value || 'N/A'
          }}
        />
      ))}
  </div>
);
UsersTable.propTypes = {
  filteredUsers: PropType.arrayOf(
    PropType.shape({
      address: PropType.string,
      avatar: PropType.string,
      dateJoined: PropType.string,
      email: PropType.string.isRequired,
      fullname: PropType.string,
      mobile: PropType.shape({
        country: PropType.string,
        countryCode: PropType.string,
        dialCode: PropType.string,
        value: PropType.string
      }),
      role: PropType.string
    })
  ).isRequired
};

export default UsersTable;