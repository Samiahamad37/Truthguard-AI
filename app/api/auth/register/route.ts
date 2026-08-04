import { prisma } from "@/lib/db";
import { hashPassword, signToken, toPublicUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonOk, parseJsonBody } from "@/lib/api-utils";
import { seedReports } from "@/lib/seed-reports";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<RegisterBody>(request);
    if (!body?.name || !body?.email || !body?.password) {
      return jsonError("Name, email, and password are required");
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return jsonError("An account with this email already exists", 409);
    }

    await seedReports(prisma);

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        settings: { create: {} },
        notifications: {
          create: [
            {
              type: "update",
              title: "Welcome to TruthGuard AI",
              message: "Your account has been created. Start verifying content today.",
            },
            {
              type: "analysis",
              title: "Getting Started",
              message: "Submit your first analysis from the Verify page.",
            },
          ],
        },
      },
    });

    const token = await signToken(user.id);
    return jsonOk({ user: toPublicUser(user), token }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
