import PropType from 'prop-types';
import React from 'react';

const UserItem = ({ user, skeleton }) => {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '80px minmax(200px, 2fr) minmax(150px, 1.5fr) minmax(150px, 1.5fr) minmax(120px, 1fr) minmax(120px, 1fr)',
    gap: '16px',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0', // Lighter border
    fontSize: '14px',
    color: '#4a4a4a', // Softer than pure black
    fontWeight: 'bold', // Explicit normal weight
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--hover-color)',
      boxShadow: '0 0 0 1px #ddd', // Subtle border effect
      borderRadius: '4px'
    }
  };

  if (skeleton) {
    return (
      <div style={rowStyle}>
        {[...Array(6)].map((_, i) => (
          <div key={`skeleton-${i}`} style={{
            background: '#eee',
            height: '20px',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite'
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={rowStyle}>
      <div style={{ justifySelf: 'center' }}>
        <img
          src={user.avatar || '/src/images/default-avatar.jpg'}
          alt="Avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{ paddingLeft: '8px' }}>{user.email}</div>
      <div>{user.fullname || 'N/A'}</div>
      <div>{user.address || 'N/A'}</div>
      <div style={{ textAlign: 'center' }}>{user.dateJoined}</div>
      <div style={{ textAlign: 'right' }}>{user.mobile}</div>
    </div>
  );
};
UserItem.propTypes = {
  user: PropType.shape({
    avatar: PropType.string,
    email: PropType.string.isRequired,
    fullname: PropType.string,
    address: PropType.string,
    dateJoined: PropType.string,
    mobile: PropType.oneOfType([PropType.string, PropType.object]),
    role: PropType.string
  }),
  skeleton: PropType.bool
};

UserItem.defaultProps = {
  user: {},
  skeleton: false
};

export default UserItem;