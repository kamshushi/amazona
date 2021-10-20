import React, { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';

export default function Shipping() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  // If we have user data , redirect to homepage
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
  }, []);
  return <div></div>;
}
