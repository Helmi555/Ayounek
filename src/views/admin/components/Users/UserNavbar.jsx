import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { FiltersToggle, SearchBar } from '@/components/common';
import { ADD_PRODUCT } from '@/constants/routes';
import PropType from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

const UserNavbar = (props) => {
  const { usersCount, totalUsersCount } = props;
  const history = useHistory();

  return (
    <div className="product-admin-header">
      <h3 className="product-admin-header-title">
        Users &nbsp;
        (
        {`${usersCount} / ${totalUsersCount}`}
        )
      </h3>
      <SearchBar name="users"/>
            &nbsp;
      
    </div>
  );
};

UserNavbar.propTypes = {
  usersCount: PropType.number.isRequired,
  totalUsersCount: PropType.number.isRequired
};

export default UserNavbar;
