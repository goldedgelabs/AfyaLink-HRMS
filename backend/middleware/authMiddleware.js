import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) return res.status(401).json({message:'Not authorized'});
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({message:'User not found'});
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({message:'Not authorized'});
  }
};
