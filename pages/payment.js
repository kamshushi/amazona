import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/dist/client/router';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
// MUI
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';

const Payment = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
    userInfo,
  } = state;
  const [paymentMethod, setPaymentMethod] = useState('');

  // redirect to /shipping if no shipping address, else setPayment from cookies
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    } else if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment Method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
