const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    company: user.company,
    savedJobs: user.savedJobs,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse,
  });
};

module.exports = { generateToken, sendTokenResponse };