import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import type { Notification } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return jsonError("Notification not found", 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    const mapped: Notification = {
      id: updated.id,
      type: updated.type as Notification["type"],
      title: updated.title,
      message: updated.message,
      read: updated.read,
      createdAt: updated.createdAt.toISOString(),
    };

    return jsonOk(mapped);
  } catch (error) {
    return handleApiError(error);
  }
}
