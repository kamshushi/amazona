import NextLink from 'next/link';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
// MUI
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
} from '@material-ui/core';
// DB
import db from '../../utils/db';
import Product from '../../models/Product';

const productScreen = (props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  // Getting specific product
  const { product } = props;

  // Rendering
  if (!product) {
    return <div>Product Not Found</div>;
  }

  // Add to cart handler
  const addToCart = async () => {
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
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back to Products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              {/* variant='h1' for applying the h1 styles in the theme */}
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCart}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default productScreen;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObject(product),
    },
  };
};
