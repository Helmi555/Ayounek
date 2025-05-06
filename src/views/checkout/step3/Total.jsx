import { useEffect } from 'react';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { CHECKOUT_STEP_2 } from '@/constants/routes';
import { useFormikContext } from 'formik';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setPaymentDetails } from '@/redux/actions/checkoutActions';
import { clearBasket } from '@/redux/actions/basketActions';
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import firebaseInstance from '@/services/firebase';

const Total = ({ isInternational, subtotal, type }) => {
  console.warn("Total : ", isInternational, subtotal)
  const { values, submitForm } = useFormikContext();

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



  const history = useHistory();
  const dispatch = useDispatch();

  const onConfirm = () => {
    console.info("HIIIIIIIIIII : ", values, type);
        submitForm();
        try{

          const result= firebaseInstance.createOrder({
            basket: state.basket,
            shipping: state.shipping,
            payment:state.payment,
            total:subtotal + (isInternational ? 50 : 0),
            email:state.shipping.email,
            date: new Date().toISOString(),
            status: 'pending'
            
        })

          Swal.fire({
            title: 'Payment Successful!',
            text: 'Your purchase has been successfully completed. Thank you for trusting Ayounek!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            willClose: () => {
              dispatch(resetCheckout())
              dispatch(clearBasket())
              history.push('/');
            }
          });
        }catch(e){
          console.error("Error while creating order : ", e)
          Swal.fire({
              title: 'Order Failed!',
              text: `Oops! Something went wrong while processing your order. ${e.message}`,
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'Retry',
              timer: 5000,
              timerProgressBar: true
         
          });

        }
   

  };



  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    const { cardnumber, ccv, ...rest } = values;

    dispatch(setPaymentDetails({ ...rest })); // save payment details
    history.push(CHECKOUT_STEP_2);
  };

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h2 className="basket-total-amount">
          {displayMoney(subtotal + (isInternational ? 50 : 0))}
        </h2>
      </div>
      <br />
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => onClickBack(values)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp;
          Go Back
        </button>
        <button
          className="button"
          disabled={false}
          onClick={onConfirm}
          type="button"
        >
          <CheckOutlined />
          &nbsp;
          Confirm
        </button>
      </div>
    </>
  );
};

Total.propTypes = {
  isInternational: PropType.bool.isRequired,
  subtotal: PropType.number.isRequired
};

export default Total;
