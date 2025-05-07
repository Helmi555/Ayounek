import { Boundary } from '@/components/common';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import UserNavbar from '../components/Users/UserNavbar';
import firebaseInstance from '@/services/firebase';
import UsersTable from '../components/Users/UsersTable';

const Users = () => {
  useDocumentTitle('Product List | Ayounek Admin');
  useScrollTop();

  const [users, setUsers] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersRef = await firebaseInstance.getUsers();
        console.info("Users are : ", usersRef);
        const usersData = usersRef.items;
        setUsers(usersData);
        setCount(usersRef.total);
        console.info("Users count: ", usersRef.total);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

  }, []);

  return (
    <Boundary>
      {isLoading ? (
        <div>Loading users...</div> 
      ) : (
        <>
          <UserNavbar
             usersCount={count || 0}
             totalUsersCount={count || 0}
          />
          <UsersTable filteredUsers={users} />
        </>
      )}
    </Boundary>
  );
};

export default Users;