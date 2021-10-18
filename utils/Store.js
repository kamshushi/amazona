import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
  },
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
    case 'CART_ADD_ITEM':
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
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    default:
      return state;
  }
};
export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
