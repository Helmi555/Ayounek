import { Boundary } from '@/components/common';
import { AppliedFilters, UserList } from '@/components/user';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectUserFilter } from '@/selectors/userSelector'; // Create user selector
// import UsersNavbar from '../components/UsersNavbar';
import UsersTable from './UsersTable';

const Users = () => {
  useDocumentTitle('User List | Admin Panel');
  useScrollTop();

  const store = useSelector((state) => ({
    filteredUsers: selectUserFilter(state.users.items, state.filter),
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading,
    users: state.users
  }));

  return (
    <Boundary>
      {/* <UsersNavbar
        usersCount={store.users.items.length}
        totalUsersCount={store.users.total}
      /> */}
      <div className="user-admin-items">
        <UserList {...store}>
          <AppliedFilters filter={store.filter} />
          <UsersTable filteredUsers={store.filteredUsers} />
        </UserList>
      </div>
    </Boundary>
  );
};

export default withRouter(Users);