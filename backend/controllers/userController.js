const bcrypt = require('bcryptjs');
const User = require('../models/User');

const verifyAdminAndGetUsers = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Please enter your admin password' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const isMatch = await bcrypt.compare(password, req.user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect admin password' });
        }

        const users = await User.find({}).select('-password -__v');
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    verifyAdminAndGetUsers
};
