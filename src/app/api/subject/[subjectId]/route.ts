import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { DocumentUploadValidator } from "@/lib/validators/DocumentUploadValidator"
import { access } from "@prisma/client"
import { getServerSession } from "next-auth"

export async function GET(req:Request, { params }: { params: { subjectId: string } }) {
  const subjectId = params.subjectId
  const session = await getServerSession(authOptions);
  if(!session?.user){
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const documents = await db.subject.findUnique({
      where: {
        id: subjectId
      },
      include: {
        documents: true,
        classroom: {
          include: {
            users: true
          }
        },
      }
    })

    const isUserInClassroom = documents?.classroom?.users.some(user => user.userId === session?.user.id)

    if(!isUserInClassroom) return new Response("User is not a member", { status: 401 });

    if (documents) {
      return new Response(JSON.stringify(documents), { status: 200 })
    }
    return new Response(JSON.stringify({message: "Subject not found"}), { status: 404 })
  } catch (error) {
    console.log("GET api/subject/[subjectId] error", error)
    return new Response(JSON.stringify({message: "Error"}), { status: 500 })
  }
}

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
    const { uploadedAt, classroomId,subjectId, fileUrl, fileSize, uploadedBy, name,id } =
      DocumentUploadValidator.parse(body);

    const newFile = await db.document.create({
      data : {
        subjectId,
        fileUrl,
        name,
        userId : session.user.id,
        uploadedAt,
        uploadedBy,
        fileSize,
        id : id
      }
    });
    if (!newFile) {
      return new Response("Error while uploading", { status: 500 });
    }

    console.log("POST : /api/subject/[subjectId]", body);
    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log("POST : /api/aiml-library", error);
    return new Response("Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if(session?.user.access === "STUDENT"){
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const fileId = new URL(req.url).searchParams.get("fileId");

    const documents = await db.document.delete({
      where : {
        id : fileId as string
      }
    })

    if (!documents) {
      return new Response("Error while deleting", { status: 500 });
    }

    return new Response("Success", { status: 200 });
    
  } catch (error) {
    console.log("DELETE : /api/subject/[subjectId]", error);
    return new Response("Error", { status: 500 });
  }
}

