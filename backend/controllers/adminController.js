const User = require('../models/User');
const Analysis = require('../models/Analysis');

const getAllUsers = async (req, res, next) => {
  try {
    const users = User.getAll();
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be user or admin.' });
    }

    const updatedUser = User.updateRole(id, role);
    return res.json({ success: true, message: `User role updated to ${role}.`, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Admin cannot delete their own account.' });
    }

    User.delete(id);
    return res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getSystemStats = async (req, res, next) => {
  try {
    const users = User.getAll();
    const aiStats = Analysis.getStats();
    const recentAnalyses = Analysis.getAll().slice(0, 10);

    return res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        adminCount: users.filter(u => u.role === 'admin').length,
        userCount: users.filter(u => u.role === 'user').length,
        totalAnalyses: aiStats.totalAnalyses,
        sentimentAnalyses: aiStats.sentimentCount,
        summaries: aiStats.summaryCount,
        skillMatches: aiStats.skillCount
      },
      recentAnalyses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats
};
