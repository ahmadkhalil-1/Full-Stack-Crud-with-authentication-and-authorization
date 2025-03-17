import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Ensure password is hashed correctly
        const hashPassword = await bcrypt.hash(password.toString(), 10);

        // Create and save new user
        const user = new User({
            name,
            email,
            password: hashPassword
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error generating token'
                });
            }
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: user,
                token
            });
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error generating token'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: existingUser,
                token
            });
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};

// Forgot Password (Request Token)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate JWT token (valid for 7 days)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        // Configure Nodemailer (Use app-specific password for Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variable
                pass: process.env.EMAIL_PASS, // Use environment variable
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Ensure this matches the authenticated user
            to: email,
            subject: 'Reset Password Request',
            text: `Click here to reset your password: http://localhost:5173/reset-password/${user._id}/${token}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ status: "Error", message: "Invalid or expired token" });
        }

        // Ensure the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({ status: "Success", message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ status: "Error", message: "Something went wrong" });
    }
};

