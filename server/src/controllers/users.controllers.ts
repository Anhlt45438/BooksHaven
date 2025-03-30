import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import User from "~/models/schemas/User.schemas";
import usersServices from "~/services/users.services";
import { getUserRolesHelper } from "./roles.controller";
import databaseServices from "~/services/database.services";
import { signJwt, verifyToken } from "~/untils/jwt";
const nodemailer = require('nodemailer')
import { config } from "dotenv";
import { hasPassword } from "~/untils/crypto";
config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  // secure: false, // use SSL
  auth: {
    user: 'leeminhovn2k4@gmail.com',
    pass: 'jhxcauxqjlubxzxk',
  }
});

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Generate reset token
    const resetToken = await signJwt({
      payload: { email, type: 'reset_password' },
      privateKey: process.env.PRIVATE_KEY_JWT || '',
      options: { expiresIn: '1h' }
    });

    // Save reset token to user document
    await databaseServices.users.updateOne(
      { email },
      { $set: { resetPasswordToken: resetToken, resetPasswordExpires: new Date(Date.now() + 3600000) } }
    );

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/change-password?token=${resetToken}`;
    const mailOptions = {
      from: `leeminhovn2k4@gmail.com`,
      to : email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    res.status(200).json({
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({
      error: 'Error sending password reset email'
    });
  }
};


export const loginController = async (req: Request, res: Response) => {
  const user_id: ObjectId = req.body.dataUser._id;
  try {
    const [accessToken, refreshToken] = await usersServices.login({
      user_id: user_id.toString(),
    });
    const vai_tro = await getUserRolesHelper(user_id.toString());

    const { password, ...userDataWithoutPassword } = req.body.dataUser;
    return res.status(200).json({
      ...userDataWithoutPassword,
      vai_tro: vai_tro,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
  }

  return res.status(400).json({ message: "fail login" });
};

export const registerController = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const dataUser: User = await usersServices.register({
      email,
      password: req.body.password,
      name,
      sdt: req.body.sdt,
    });
    const vai_tro = await getUserRolesHelper(dataUser.getId());

    const { password, ...userDataWithoutPassword } = dataUser;
    
    res.status(200).json({
      ...userDataWithoutPassword,
      vai_tro: vai_tro
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "fail register" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const { user_id, refreshToken } = req.body;
  try {
    const result = await usersServices.logout({ user_id: user_id });

    return res.status(200).json({
      message: "Success logout",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({
      message: err as string,
    });
  }
};


export const userInfoAccountController = async (
  req: Request,
  res: Response,
) => {
  const resultGet: WithId<User> | null = await usersServices.getUserInfoAccount(
    req.query.user_id?.toString() || "",
  );
  if (resultGet !== null) {
    const vai_tro = await getUserRolesHelper(req.query.user_id?.toString() || "");
    const { password, ...userDataWithoutPassword } = resultGet;
    return res.status(200).json({...userDataWithoutPassword,
      vai_tro: vai_tro
    });
  } else {
    return res.status(404).json({ err: "Not found account" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await usersServices.updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const vai_tro = await getUserRolesHelper(userId);
    const { password, ...userDataWithoutPassword } = updatedUser as User;

    return res.status(200).json({
      ...userDataWithoutPassword,
      vai_tro
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating user" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = await verifyToken(token, process.env.PRIVATE_KEY_JWT || '');
    if (!decoded || decoded.type !== 'reset_password') {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const email = decoded.email;

    // Find user and check if token is still valid
    const user = await databaseServices.users.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token fields
    await databaseServices.users.updateOne(
      { email },
      {
        $set: { password: hasPassword(newPassword) },
        $unset: { resetPasswordToken: '', resetPasswordExpires: '' }
      }
    );

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const skip = (page - 1) * limit;
    
    const users = await databaseServices.users
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await databaseServices.users.countDocuments({});
    
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({
      data: usersWithoutPassword,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      message: 'Error getting users list'
    });
  }
};

