const Analysis = require('../models/Analysis');
const User = require('../models/User');

const getUserHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = Analysis.getByUserId(userId);
    return res.json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};

const deleteHistoryItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = Analysis.delete(id, userId);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'History record not found or unauthorized.' });
    }

    return res.json({ success: true, message: 'Analysis record deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, bio } = req.body;

    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    const updatedUser = User.updateProfile(userId, { fullName, bio: bio || '' });
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserHistory,
  deleteHistoryItem,
  updateProfile
};
