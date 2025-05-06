/* eslint-disable react/no-multi-comp */
import { LoadingOutlined } from '@ant-design/icons';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { lazy, Suspense,useEffect } from 'react';
import UserTab from '../components/UserTab';
import { useSelector } from 'react-redux';
import firebase from '@/services/firebase';

import  UserOrdersTab  from  '../components/UserOrdersTab'

const UserAccountTab = lazy(() => import('../components/UserAccountTab'));
const UserWishListTab = lazy(() => import('../components/UserWishListTab'));

const Loader = () => (
  <div className="loader" style={{ minHeight: '80vh' }}>
    <LoadingOutlined />
    <h6>Loading ... </h6>
  </div>
);

const UserAccount = () => {
  useScrollTop();
  useDocumentTitle('My Account | Ayounek');

    const state = useSelector((store) => ({
      isAuth: !!store.auth.id && !!store.auth.role,
      basket: store.basket,
      shipping: store.checkout.shipping,
      payment: store.checkout.payment,
      profile: store.profile
    }));

    useEffect(() => {
      console.info("Basket is : ", state.basket)
      console.info("Shipping is : ", state.shipping)
      console.info("Payment is : ", state.payment)
      console.info("Profile is : ", state.profile)
    }, [])
  


  return (
    <UserTab>
      <div index={0} label="Account">
        <Suspense fallback={<Loader />}>
          <UserAccountTab />
        </Suspense>
      </div>
      {/* <div index={1} label="My Wish List">
        <Suspense fallback={<Loader />}>
          <UserWishListTab />
        </Suspense>
      </div> */}
      <div index={2} label="My Orders">
        <Suspense fallback={<Loader />}>
          <UserOrdersTab  email={state.profile.email}/>
        </Suspense>
      </div>
    </UserTab>
  );
};

export default UserAccount;
