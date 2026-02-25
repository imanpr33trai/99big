import { Pool } from "mysql2/promise";
import { getAdminSettings, getPointListTelegram } from "src/db/user.queries";

export const resolveTelegramContact = async (db: Pool, user: any | null): Promise<string> => {
  // No authenticated user - return default admin telegram
  if (!user) {
    const settings = await getAdminSettings(db);
    return settings.telegram || "";
  }

  // User is admin/moderator (level > 0) - return admin settings
  if (user.userLevel !== 0) {
    const settings = await getAdminSettings(db);
    return settings.telegram || "";
  }

  // Regular user - check their CTV (collaborator) telegram
  const ctvTelegram = await getPointListTelegram(db, user.ctv);

  if (ctvTelegram) {
    return ctvTelegram;
  }

  // Fallback to admin settings
  const settings = await getAdminSettings(db);
  return settings.telegram || "";
};
