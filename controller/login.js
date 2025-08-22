const model = require('../model/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password ) {

      return res.status(400).json({
        result: false,
        message: 'Email and Password is required',
      });
    }
  

    // Check if user exists
    const checkUser = await model.CheckUser(email);
    if (checkUser.length == 0) {
      return res.status(404).json({
        result: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, checkUser[0].u_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        result: false,
        message: 'Invalid credentials',
      });
    }
    // Generate JWT token
    const payload = {
      u_id: checkUser[0].u_id,
      email: checkUser[0].u_email,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Respond with user data and token
    return res.status(200).json({
      result: true,
      message: 'Login successful',
      user: {
        u_id: checkUser[0].u_id,
        name: checkUser[0].u_name,
        email: checkUser[0].u_email,
        role: checkUser[0].u_role,
        user_token: token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};
