const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_for_hackathon',
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken };
