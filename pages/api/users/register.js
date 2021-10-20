import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  const { name, password, email } = req.body;
  await db.connect();

  //   Creating a new user instance
  const newUser = new User({
    name,
    password: bcrypt.hashSync(password),
    email,
    isAdmin: false,
  });
  //   Adding the instance to the db
  const createdUser = await newUser.save();
  await db.disconnect();

  const token = signToken(createdUser);
  res.send({
    token,
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
  });
});

export default handler;
