import { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import User from "~/models/schemas/User.schemas";
import usersServices from "~/services/users.services";
import { getUserRolesHelper } from "./roles.controller";

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

