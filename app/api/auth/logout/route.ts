import { jsonOk } from "@/lib/api-utils";

export async function POST() {
  return jsonOk({ success: true });
}
