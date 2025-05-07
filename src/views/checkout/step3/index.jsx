import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React,{useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment from './CreditPayment';
import PayPalPayment from './PayPalPayment';
import Total from './Total';
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { resetCheckout } from '@/redux/actions/checkoutActions';
import { clearBasket } from '@/redux/actions/basketActions';
import firebaseInstance from '@/services/firebase';



const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Name should be at least 4 characters.')
    .required('Name is required'),
  cardnumber: Yup.string()
    .min(13, 'Card number should be 13-19 digits long')
    .max(19, 'Card number should only be 13-19 digits long')
    .required('Card number is required.'),
  expiry: Yup.date()
    .required('Credit card expiry is required.'),
  ccv: Yup.string()
    .min(3, 'CCV length should be 3-4 digit')
    .max(4, 'CCV length should only be 3-4 digit')
    .required('CCV is required.'),
  type: Yup.string().required('Please select paymend mode')
});

const Payment = ({ shipping, payment, subtotal }) => {
  useDocumentTitle('Check Out Final Step | Ayounek');
  useScrollTop();



  const history = useHistory();
  const dispatch = useDispatch();


  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'paypal'
  };


  const onConfirm = () => {
    console.info("aaaaaaaaaaaaaaaaaaaa")

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
         
          })}
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onConfirm}
      >
        {({ values }) => (
          <Form className="checkout-step-3">
            <CreditPayment />
            <PayPalPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
              type={values.type}
            />
          </Form>
        )}

      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);
