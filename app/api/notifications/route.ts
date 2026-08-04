import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import type { Notification } from "@/types";

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const mapped: Notification[] = notifications.map((n) => ({
      id: n.id,
      type: n.type as Notification["type"],
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }));

    return jsonOk(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireAuth(request);

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
