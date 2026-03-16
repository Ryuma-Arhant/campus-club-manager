import { validationResult, body } from 'express-validator';
import userModel from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import generateToken from '../utils/generateToken.js';
import { success, error } from '../utils/responseHelper.js';

export const register = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const { name, email, password } = req.body;
      const existing = await userModel.findByEmail(email);
      if (existing) return error(res, 'Email already in use', 409);

      const hashed = await hashPassword(password);
      const id = await userModel.create({ name, email, password: hashed });
      const user = await userModel.findById(id);
      const token = generateToken(user);

      return success(res, { user, token }, 'Registration successful', 201);
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user) return error(res, 'Invalid credentials', 401);

      const valid = await comparePassword(password, user.password);
      if (!valid) return error(res, 'Invalid credentials', 401);

      const token = generateToken(user);
      const { password: _pw, ...userWithoutPassword } = user;

      return success(res, { user: userWithoutPassword, token }, 'Login successful');
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateProfile = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const { name, email, avatar_url } = req.body;
      const existing = await userModel.findByEmail(email);
      if (existing && existing.id !== req.user.id) return error(res, 'Email already in use', 409);

      await userModel.updateProfile(req.user.id, { name, email, avatar_url: avatar_url || null });
      const updated = await userModel.findById(req.user.id);
      return success(res, updated, 'Profile updated');
    } catch (err) {
      return error(res, err.message);
    }
  },
];
