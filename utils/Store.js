import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return {
        ...state,
        darkMode: true,
      };
    case 'DARK_MODE_OFF':
      return {
        ...state,
        darkMode: false,
      };
    case 'ADD_CART_ITEM': {
      const newItem = action.payload;
      // this returns the item in cart if it exists
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      // if the item exists already in the cart , I replace it with the newItem(which updates the quantity) , else I add the newItem to the cart
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => {
            return item.name === existItem.name ? newItem : item;
          })
        : [...state.cart.cartItems, newItem];
      // Update cookies
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case 'REMOVE_CART_ITEM': {
      const itemToDelete = action.payload;
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== itemToDelete._id
      );
      // Update cookies
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }
    case 'USER_LOGIN': {
      return {
        ...state,
        userInfo: action.payload,
      };
    }
    case 'USER_LOGOUT': {
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [] },
      };
    }
    default:
      return state;
  }
};
export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
