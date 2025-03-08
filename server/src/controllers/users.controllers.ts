import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import User from "~/models/schemas/User.schemas";
import usersServices from "~/services/users.services";

export const loginController = async (req: Request, res: Response) => {
  const user_id: ObjectId = req.body.dataUser._id;
  try {
    const [accessToken, refreshToken] = await usersServices.login({
      user_id: user_id.toString(),
    });
    const { password, ...userDataWithoutPassword } = req.body.dataUser;
    return res.status(200).json({
      ...userDataWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
  }

  return res.status(400).json({ message: "fail login" });
};
export const registerController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const dataUser: User = await usersServices.register({
      email,
      password,
      name,
    });
    
    res.status(200).json(dataUser);
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
    return res.status(200).json(resultGet);
  } else {
    return res.status(404).json({ err: "Not found account" });
  }
};

