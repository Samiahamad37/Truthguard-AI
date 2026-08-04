import { prisma } from "@/lib/db";
import {
  signToken,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import { handleApiError, jsonError, jsonOk, parseJsonBody } from "@/lib/api-utils";
import { seedReports } from "@/lib/seed-reports";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<LoginBody>(request);
    if (!body?.email || !body?.password) {
      return jsonError("Email and password are required");
    }

    await seedReports(prisma);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await signToken(user.id);
    return jsonOk({ user: toPublicUser(user), token });
  } catch (error) {
    return handleApiError(error);
  }
}
