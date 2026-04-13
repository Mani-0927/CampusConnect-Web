const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'campusconnectsecretkey123', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, identifier, password, otp } = req.body;

        if (!name || !identifier || !password || !otp) {
            return res.status(400).json({ message: 'Please add all fields including OTP' });
        }

        const userExists = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otpRecord = await OTP.findOne({ identifier }).sort({ createdAt: -1 });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if this is the first user, if so make them admin
        const count = await User.countDocuments({});
        const role = count === 0 ? 'admin' : 'user';

        const userPayload = {
            name,
            password: hashedPassword,
            role
        };
        
        if (identifier.includes('@')) {
            userPayload.email = identifier.toLowerCase();
        } else {
            userPayload.mobile = identifier;
        }

        const user = await User.create(userPayload);

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: identifier?.toLowerCase() }, { mobile: identifier }]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const sendOTP = async (req, res) => {
    try {
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ message: 'Email or Mobile Number is required' });
        }

        const userExists = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }]
        });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ identifier });
        await OTP.create({ identifier, otp: otpCode });

        const message = `Your OTP for CampusConnect registration is ${otpCode}. It is valid for 5 minutes.`;

        if (identifier.includes('@')) {
            await sendEmail({
                email: identifier,
                subject: 'CampusConnect - Registration OTP',
                message,
                html: `<p>Your OTP for CampusConnect registration is <strong>${otpCode}</strong>. It is valid for 5 minutes.</p>`
            });
        } else {
            console.log('\n=============================================');
            console.log('MOCK SMS OTP (No SMS Gateway Configured)');
            console.log('=============================================');
            console.log(`To Mobile: ${identifier}`);
            console.log(`OTP Code: ${otpCode}`);
            console.log('=============================================\n');
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    sendOTP,
};
