import { Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { findUserByToken, getAdminSettings } from "src/db/user.queries";
import { resolveTelegramContact } from "src/services/customerSevice.service";
import { authCookieSchema } from "src/types/auth.types";

export const customerServiceMenuHandler =
  (db: Pool) =>
  async (req: Request, res: Response): Promise<void> => {
    const requestId = crypto.randomUUID();

    try {
      // 1. Get auth token from cookie
      const authToken = req.cookies?.auth;

      if (!authToken) {
        // No auth - get default admin telegram
        const settings = await getAdminSettings(db);

        return res.render("customerServiceMenu.ejs", {
          telegram: settings.telegram || "",
          isAuthenticated: false,
        });
      }

      // 2. Validate token format
      const tokenResult = authCookieSchema.safeParse(authToken);
      if (!tokenResult.success) {
        const settings = await getAdminSettings(db);

        return res.render("customerServiceMenu.ejs", {
          telegram: settings.telegram || "",
          isAuthenticated: false,
          error: "Invalid auth token",
        });
      }

      // 3. Find user by token
      const user = await findUserByToken(db, authToken);

      // 4. Resolve appropriate telegram contact
      const telegram = await resolveTelegramContact(db, user);

      // 5. Render view
      return res.render("customerServiceMenu.ejs", {
        telegram,
        isAuthenticated: !!user,
        userLevel: user?.userLevel || null,
      });
    } catch (error) {
      console.error(`[${requestId}] Customer service menu error:`, error);

      // Fallback render with empty telegram
      return res.render("customerServiceMenu.ejs", {
        telegram: "",
        isAuthenticated: false,
        error: "Service temporarily unavailable",
      });
    }
  };
