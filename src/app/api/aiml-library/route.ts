import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AimlFileUploadValidator } from "@/lib/validators/AimlFileUploadValidator";
import { access } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (session.user.access === access.STUDENT) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { uploadedAt, userId, fileUrl, fileSize, userName, name } =
      AimlFileUploadValidator.parse(body);

    await db.file.create({
      data: {
        uploadedAt,
        userId,
        fileUrl,
        fileSize,
        uploadedBy: userName,
        name
      }
    })
    console.log("POST : /api/aiml-library", body);
    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log("POST : /api/aiml-library", error);
    return new Response("Error", { status: 500 });
  }
}
