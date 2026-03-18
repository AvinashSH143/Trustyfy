import express from 'express';
import { getUnapprovedProviders, approveProvider, rejectProvider } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/unapproved', protect, admin, getUnapprovedProviders);
router.patch('/:id/approve', protect, admin, approveProvider);
router.delete('/:id/reject', protect, admin, rejectProvider);

export default router;
