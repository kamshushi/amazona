import nc from 'next-connect';
import Product from '../../models/Product';
import db from '../../utils/db';
import data from '../../utils/data';
import User from '../../models/User';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  //   Delete existing data then add data to products
  await Product.deleteMany();
  await Product.insertMany(data.products);

  // Users
  await User.deleteMany();
  await User.insertMany(data.users);

  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;
