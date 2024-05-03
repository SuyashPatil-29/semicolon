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
    const { fileUrl, fileSize, userId, uploadedBy, uploadedAt, name } = AimlFileUploadValidator.parse(body);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { Files: true }, // Include the user's files
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const newFile = await db.file.create({
      data: {
        uploadedAt,
        userId,
        fileUrl,
        fileSize,
        uploadedBy,
        name,
      },
    });

    // Update the user's files array with the new file
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        Files: {
          connect: { id: newFile.id },
        },
      },
    });

    console.log("POST : /api/aiml-library", body);
    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log("POST : /api/aiml-library", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (session.user.access === access.STUDENT) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const files = await db.file.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
    });
    console.log("GET : /api/aiml-library", files);
    return new Response(JSON.stringify(files), { status: 200 });
  } catch (error) {
    console.log("GET : /api/aiml-library", error);
    return new Response("Error", { status: 500 });
  }
}
