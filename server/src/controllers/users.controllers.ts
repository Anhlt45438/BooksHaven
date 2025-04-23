import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import User from "~/models/schemas/User.schemas";
import usersServices from "~/services/users.services";
import { getUserRolesHelper } from "./roles.controller";
import databaseServices from "~/services/database.services";
import { signJwt, verifyToken } from "~/untils/jwt";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import { hasPassword } from "~/untils/crypto";
import PasswordReset from "~/models/schemas/PasswordReset.schemas";
import { getGenerateTemplate } from '~/utils/email.utils';
config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Find user first
    const user = await databaseServices.users.findOne({ email });
    if (!user) {
      // Return success even if email doesn't exist (security best practice)
      return res.status(200).json({
        message: 'Password reset email sent successfully'
      });
    }

    // Generate reset token
    const resetToken = await signJwt({
      payload: { email, type: 'reset_password' },
      privateKey: process.env.PRIVATE_KEY_JWT || '',
      options: { expiresIn: '1h' }
    });

    // Delete any existing reset tokens for this user
    await databaseServices.tokensResetPassword.deleteMany({
      user_id: user._id
    });

    // Create new password reset record
    const passwordReset = new PasswordReset({
      user_id: user._id,
      email: user.email,
      token: resetToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
      created_at: new Date()
    });

    // Save new token
    await databaseServices.tokensResetPassword.insertOne(passwordReset);

    // Send email
    const resetUrl = `http://${process.env.DB_IP}:${process.env.PORT}/static/reset-password-web.html?token=${resetToken}`;
    
    // Get HTML template and send email
    try {
      const htmlContent = await getGenerateTemplate('reset-password-email', {
        name: user.username || 'Valued Customer',
        resetUrl,
        logoUrl: `http://${process.env.DB_IP}:${process.env.PORT}/static/images/logo_app.jpg`
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Change your password Book's Haven",
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      
      res.status(200).json({
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({
        error: 'Error sending password reset email'
      });
    }
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
    // Check if account was marked for deletion and cancel it
    if (req.body.dataUser.ngay_xoa) {
      await usersServices.cancelDeleteAccount(user_id.toString());
    }
    
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
  const { user_id } = req.body;
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

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Verify token
    try {
      const decoded = await verifyToken(
        token,
       process.env.PRIVATE_KEY_JWT || ''
      );

      if (!decoded || typeof decoded !== 'object' || !('email' in decoded)) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      const email = decoded.email;

      // Find token in database
      const tokenRecord = await databaseServices.tokensResetPassword.findOne({ token });
      if (!tokenRecord) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Check if token is expired
      if (new Date() > new Date(tokenRecord.expires)) {
        await databaseServices.tokensResetPassword.deleteOne({ token });
        return res.status(400).json({ error: 'Token has expired' });
      }

      // Update user password
      const hashedPassword = hasPassword(newPassword);
      const updateResult = await databaseServices.users.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete used token
      await databaseServices.tokensResetPassword.deleteOne({ token });

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(400).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ error: 'Error resetting password' });
  }
};

export const requestDeleteAccountController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Verify user exists
    const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Request account deletion
    const updatedUser = await usersServices.requestDeleteAccount(userId);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password, ...userDataWithoutPassword } = updatedUser as User;
    
    return res.status(200).json({
      ...userDataWithoutPassword,
      message: "Account scheduled for deletion. Will be permanently deleted in 7 days unless you log in again."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error requesting account deletion" });
  }
};

export const cancelDeleteAccountController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Verify user exists
    const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Cancel account deletion
    const updatedUser = await usersServices.cancelDeleteAccount(userId);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password, ...userDataWithoutPassword } = updatedUser as User;
    
    return res.status(200).json({
      ...userDataWithoutPassword,
      message: "Account deletion canceled successfully."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error canceling account deletion" });
  }
};

export const cleanupExpiredAccountsController = async (req: Request, res: Response) => {
  try {
    // This endpoint should be protected and only accessible by admins
    const deletedCount = await usersServices.permanentlyDeleteExpiredAccounts();
    
    return res.status(200).json({
      message: `Successfully deleted ${deletedCount} expired accounts`,
      deletedCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error cleaning up expired accounts" });
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

export const searchUsersByNameController = async (req: Request, res: Response) => {
  const { q } = req.query;
  const { page = 1, limit = 10 } = req.query;

  try {
    // Validate search query
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        message: 'Invalid search query',
        error: 'Search query is required'
      });
    }

    // Create search query with error handling
    const query = { 
      username: { 
        $regex: q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
        $options: 'i' 
      } 
    };

    const users = await databaseServices.users.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray();
    
    // Remove password from results
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const total = await databaseServices.users.countDocuments(query);

    return res.json({
      message: 'Search users successfully',
      data: usersWithoutPassword,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({
      message: 'Error searching users',
      error: 'Internal server error'
    });
  }
};

