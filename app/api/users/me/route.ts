import { requireAuth, toPublicUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk, parseJsonBody } from "@/lib/api-utils";

interface UpdateProfileBody {
  name?: string;
  email?: string;
}

export async function GET(request: Request) {
  try {
    const userId = await requireAuth(request);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return jsonError("User not found", 404);
    return jsonOk(toPublicUser(user));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireAuth(request);
    const body = await parseJsonBody<UpdateProfileBody>(request);
    if (!body?.name && !body?.email) {
      return jsonError("Nothing to update");
    }

    if (body.email) {
      const existing = await prisma.user.findFirst({
        where: { email: body.email, NOT: { id: userId } },
      });
      if (existing) return jsonError("Email already in use", 409);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.email ? { email: body.email } : {}),
      },
    });

    return jsonOk(toPublicUser(user));
  } catch (error) {
    return handleApiError(error);
  }
}
