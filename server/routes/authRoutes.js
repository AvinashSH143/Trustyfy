import express from 'express';
import { registerUser, loginUser, registerProvider, loginProvider, updateProviderProfile, updateCustomerProfile, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/customer/register', registerUser);
router.post('/customer/login', loginUser);
router.put('/customer/profile', protect, updateCustomerProfile);
router.post('/provider/register', registerProvider);
router.post('/provider/login', loginProvider);
router.put('/provider/profile', protect, updateProviderProfile);

export default router;
