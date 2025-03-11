import { Request, Response, NextFunction } from "express";

import { WithId } from "mongodb";
import User from "~/models/schemas/User.schemas";
import { hasPassword } from "~/untils/crypto";
import databaseServices from "~/services/database.services";
import { verifyToken } from "~/untils/jwt";
import usersServices from "~/services/users.services";
import { AccountStatus } from "~/constants/enum";
import { checkSchema } from 'express-validator';



export const loginValidator = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password = "", email = "" } = _req.body;
  if (password.length === 0 || email.length === 0) {
    return res.status(400).json({ message: "Error your data send" });
  }
  const accountCheck: WithId<User> | null =
    await databaseServices.users.findOne({ email: email });
  if (accountCheck === null) {
    return res.status(400).json({
      error: "Account does not exist",
    });
  } else if (accountCheck.password !== hasPassword(password)) {
    return res.status(400).json({
      error: "Password is wrong",
    });
  } else if(accountCheck.trang_thai === AccountStatus.Ban) {
    return res.status(400).json({
      error: "Account is block",
    });
  }
  _req.body.dataUser = accountCheck;
  next();
};

export const registerValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email = "", password = "", sđt = "" } = req.body;
  switch (true) {
    case password.length === 0 || email.length === 0:
      return res.status(400).json({ message: "Error your data send" });

    case password.length === 0:
      return res.status(400).json({ error: "type your password" });

    case password.length < 6:
      return res
        .status(400)
        .json({ error: "min length password character > 6" });

    case sđt.length === 0:
      return res.status(400).json({ error: "type your phone number" });
    case sđt.length < 9:
      return res.status(400).json({ error: "min length phone number > 9" });
    case sđt.length > 12:
      return res.status(400).json({ error: "max length phone number < 12" });
      
    case email.length === 0:
      return res.status(400).json({ error: "type your email" });

    case email.length < 5:
      return res.status(400).json({ error: "min length email character > 5" });

    default: {
      // Check both email and phone number duplicates
      const existingUser = await databaseServices.users.findOne({
        email: email
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(409).json({
            error: "This email is already registered"
          });
        }
        // if (existingUser.sđt === sđt) {
        //   return res.status(409).json({
        //     error: "This phone number is already registered"
        //   });
        // }
      }
      return next();
    }
  }
};

export const logoutValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.refreshToken) {
    return res.json({
      message: "Invalid refreshToken",
      statusCode: 401,
    });
  }

  try {
    const decode = await verifyToken(
      req.body.refreshToken,
      process.env.PRIVATE_KEY_JWT,
    );
    req.body.user_id = decode.user_id;

    next();
  } catch (err) {
    return res.json({
      message: "Error verify refreshToken",
      statusCode: 401,
    });
  }
};
export const emailVerifyMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body?.email_verify_token) {
    return res.json({
      message: "EmailVerifyToken is Reqired",
      statusCode: 401,
    });
  }

  try {
    const decode_email_verify_token = await verifyToken(
      req.body.email_verify_token,
      process.env.PRIVATE_KEY_EMAIL_VERIFY,
    );
    req.body.decode_email_verify_token = decode_email_verify_token;

    return next();
  } catch (err) {
    console.log(err);
    res.json({
      message: "Invalid email_verify_token",
      statusCode: 401,
    });
  }
};
export const nameIsDuplicateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isDuplicate: boolean = await usersServices.checkNameIsDuplicate(
    req.body.name,
  );

  if (isDuplicate) {
    return res.status(400).json({ error: "Name already exists" });
  } else {
    next();
  }
  // return;
};

export const validateUpdateUser = checkSchema({
  username: {
    optional: true,
    isString: {
      errorMessage: 'Username must be a string'
    },
    trim: true,
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Username must be between 1 and 100 characters'
    }
  },
  sđt: {
    optional: true,
    isString: {
      errorMessage: 'Phone number must be a string'
    },
    trim: true,
    isLength: {
      options: { min: 9, max: 12 },
      errorMessage: 'Phone number must be between 9 and 12 characters'
    },
    custom: {
      options: async (value) => {
        if (!value) return true;
        const existingUser = await databaseServices.users.findOne({ sđt: value });
        if (existingUser) {
          throw new Error('Phone number is already in use');
        }
        return true;
      }
    }
  },
  dia_chi: {
    optional: true,
    isString: {
      errorMessage: 'Address must be a string'
    },
    trim: true
  },
  avatar: {
    optional: true,
    isString: {
      errorMessage: 'Avatar URL must be a string'
    },
    trim: true
  },
  password: {
    optional: true,
    isString: {
      errorMessage: 'Password must be a string'
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  }
});

// Add this after your schema validation
export const validateUpdateUserFields = (req: Request, res: Response, next: NextFunction) => {
  const updates = req.body;
  
  // Prevent updating email and _id
  if ('email' in updates || '_id' in updates ) {
    return res.status(400).json({
      error: 'Email and ID cannot be updated'
    });
  }

  next();
};
