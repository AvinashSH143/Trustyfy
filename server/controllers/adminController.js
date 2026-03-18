import Provider from '../models/Provider.js';

// @desc    Get all unapproved providers
// @route   GET /api/admin/unapproved
// @access  Private/Admin
export const getUnapprovedProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ isApproved: false }).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching unapproved providers', error: error.message });
  }
};

// @desc    Approve a provider
// @route   PATCH /api/admin/:id/approve
// @access  Private/Admin
export const approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ message: 'Provider approved successfully', providerId: provider._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error approving provider', error: error.message });
  }
};

// @desc    Reject/Delete a provider
// @route   DELETE /api/admin/:id/reject
// @access  Private/Admin
export const rejectProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ message: 'Provider rejected and removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error rejecting provider', error: error.message });
  }
};
