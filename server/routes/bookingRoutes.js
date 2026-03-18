import express from 'express';
import { createBooking, updateBookingStatus, getMyBookings, getNearbyProviders, sendCompletionOTP } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

router.route('/nearby')
  .get(protect, getNearbyProviders);

router.route('/:id/status')
  .put(protect, updateBookingStatus);

router.route('/:id/send-otp')
  .post(protect, sendCompletionOTP);

export default router;
