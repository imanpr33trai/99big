import { Request, Response } from "express";

export const aviatorController = async (req: Request, res: Response): Promise<void> => {
  const auth = req.cookies.auth;
  res.redirect(
    `https://jetx.asia/theninja/src/api/userapi.php?action=loginandregisterbyauth&token=${auth}`,
  );
};
