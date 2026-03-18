import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Customer)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one letter and one number' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      location: {
        type: 'Point',
        coordinates: req.body.coordinates || [-122.4194, 37.7749] // Default to SF for demo
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role: 'customer',
        avatar: user.avatar,
        stats: user.stats,
        location: user.location
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Auth user & get token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        role: user.role || 'customer',
        avatar: user.avatar,
        stats: user.stats,
        location: user.location
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Register a new provider
export const registerProvider = async (req, res) => {
  const { name, email, password, serviceType, serviceAreas, isAvailable, avatar } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one letter and one number' });
  }

  const providerExists = await Provider.findOne({ email });

  const provider = await Provider.create({
    name,
    email,
    password,
    serviceType,
    avatar,
    serviceAreas: serviceAreas || [],
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    location: {
      type: 'Point',
      coordinates: req.body.coordinates || [-122.4194, 37.7749] // Default to SF for demo
    }
  });

  if (provider) {
    res.status(201).json({
      _id: provider._id,
      name: provider.name,
      email: provider.email,
      token: generateToken(provider._id),
      role: 'provider',
      avatar: provider.avatar,
      stats: provider.stats,
      location: provider.location,
      serviceAreas: provider.serviceAreas,
      isAvailable: provider.isAvailable
    });
  } else {
    res.status(400).json({ message: 'Invalid provider data' });
  }
};

// @desc    Auth provider & get token
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const provider = await Provider.findOne({ email });

    if (provider && (await provider.matchPassword(password))) {
      if (!provider.isApproved) {
        return res.status(403).json({ message: 'Provider account pending admin approval. Please wait for verification.' });
      }

      res.json({
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        token: generateToken(provider._id),
        role: 'provider',
        avatar: provider.avatar,
        trustScore: provider.trustScore,
        serviceAreas: provider.serviceAreas,
        isAvailable: provider.isAvailable,
        stats: provider.stats,
        location: provider.location
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Provider Error:', error);
    res.status(500).json({ message: 'Server error during provider login', error: error.message });
  }
};

// @desc    Update provider profile (availability and areas)
export const updateProviderProfile = async (req, res) => {
  try {
    const update = {};
    if (req.body.serviceAreas !== undefined) update.serviceAreas = req.body.serviceAreas;
    if (req.body.isAvailable !== undefined) update.isAvailable = req.body.isAvailable;
    if (req.body.avatar !== undefined) update.avatar = req.body.avatar;
    if (req.body.location !== undefined) update.location = req.body.location;
    if (req.body.name !== undefined) update.name = req.body.name;

    const updatedProvider = await Provider.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedProvider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      _id: updatedProvider._id,
      name: updatedProvider.name,
      email: updatedProvider.email,
      token: req.headers.authorization.split(' ')[1], // Return existing token
      role: 'provider',
      avatar: updatedProvider.avatar,
      trustScore: updatedProvider.trustScore,
      serviceAreas: updatedProvider.serviceAreas,
      isAvailable: updatedProvider.isAvailable,
      stats: updatedProvider.stats,
      location: updatedProvider.location
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// @desc    Update customer profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const update = {};
    if (req.body.name !== undefined) update.name = req.body.name;
    if (req.body.avatar !== undefined) update.avatar = req.body.avatar;
    if (req.body.location !== undefined) update.location = req.body.location;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: req.headers.authorization.split(' ')[1],
      role: updatedUser.role || 'customer',
      avatar: updatedUser.avatar,
      stats: updatedUser.stats,
      location: updatedUser.location
    });
  } catch (error) {
    console.error('Update Customer Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// @desc    Get user profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};
