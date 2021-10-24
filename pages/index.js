import Layout from '../components/Layout';
import NextLink from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import axios from 'axios';
// MUI
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
// DB
import db from '../utils/db';
import Product from '../models/Product';

export default function Home(props) {
  const { products } = props;
  const router = useRouter();
  const { reload } = router.query;
  const { state, dispatch } = useContext(Store);

  // Add product to cart directly from home page
  const addToCart = async (product) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const UpdatedQuantity = existingItem ? existingItem.quantity + 1 : 1;
    // alert if the new quantity is larger than the quantity in stock
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < UpdatedQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({
      type: 'ADD_CART_ITEM',
      payload: { ...product, quantity: UpdatedQuantity },
    });
    router.push('/cart');
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to card
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObject),
    },
  };
};
