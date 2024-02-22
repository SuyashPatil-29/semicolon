import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateSubjectValidator } from "@/lib/validators/CreateSubjectValidator";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if(session.user.access === "STUDENT") return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const {classroomId,subjectName} = CreateSubjectValidator.parse(body);
  if(!classroomId || !subjectName) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }
  try {
    const subject = await db.subject.create({
      data: {
        name: subjectName,
        classroomId: classroomId,
        userId: session.user.id,
      },
      include: {
        documents: true,
        classroom: true,
      }
    });

    if (!subject) {
      return new Response(JSON.stringify({ error: "Failed to create subject" }), { status: 500 });
    }

    return new Response(JSON.stringify(subject), { status: 200 });
  } catch (error) {
    console.error("POST /api/subject error: ", error);
    return new Response(JSON.stringify({ error: "Failed to create subject" }), { status: 500 });
  }
}
