import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk, parseJsonBody } from "@/lib/api-utils";
import type { NotificationPreferences, UserSettings } from "@/types";

function toUserSettings(settings: {
  emailAnalysis: boolean;
  emailSecurity: boolean;
  emailUpdates: boolean;
  pushAnalysis: boolean;
  pushSecurity: boolean;
}): UserSettings {
  return {
    notifications: {
      emailAnalysis: settings.emailAnalysis,
      emailSecurity: settings.emailSecurity,
      emailUpdates: settings.emailUpdates,
      pushAnalysis: settings.pushAnalysis,
      pushSecurity: settings.pushSecurity,
    },
  };
}

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);
    let settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId } });
    }
    return jsonOk(toUserSettings(settings));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireAuth(request);
    const body = await parseJsonBody<{ notifications?: Partial<NotificationPreferences> }>(
      request
    );
    if (!body?.notifications) {
      return jsonError("Notification preferences are required");
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...body.notifications },
      update: body.notifications,
    });

    return jsonOk(toUserSettings(settings));
  } catch (error) {
    return handleApiError(error);
  }
}
