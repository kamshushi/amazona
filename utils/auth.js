import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// similar to express.js middlewares, (This function is passed like this > handler.use(isAuth) to make sure user is authenticated and adds req.user object to the request)
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxxxx  => xxxxxx
    const token = authorization.slice(7, authorization.length);

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      } else {
        req.user = decodedToken;
        // proceed to the next middleware
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token is not supplied' });
  }
};

export { signToken, isAuth };
