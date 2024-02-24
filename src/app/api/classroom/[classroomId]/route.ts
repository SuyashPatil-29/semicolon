import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions); // Ensure you pass the request to getServerSession
  const { classroomId, userId, password } = await req.json();

  // Check if the required fields are present
  if (!classroomId || !userId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  // Check if the session exists and if not, return unauthorized
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const classroom = await db.classroom.findUnique({ where: { id: classroomId }, include: { subjects: true } });
    if (!classroom) {
      return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
    }

    // Allow teachers to join without a password or if the password matches
    if (session.user.access !== "TEACHER" && classroom.password !== password) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
    }

    // Check if the user is already a member of the classroom
    const isMember = await db.classroomUser.findFirst({
      where: {
        userId: userId,
        classroomId: classroomId,
      },
    });

    if (isMember) {
      return new Response(JSON.stringify({ error: "User already a member of the classroom" }), { status: 400 });
    }

    // Create a new classroomUser entry
    const classroomUser = await db.classroomUser.create({
      data: {
        userId: userId,
        classroomId: classroomId,
      },
    });

    return new Response(JSON.stringify({ message: "Successfully joined classroom", classroomUser }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/classroom error: ", error);
    return new Response(JSON.stringify({ error: "Failed to join classroom" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params: { classroomId } }: { params: { classroomId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!classroomId) return new Response("Missing classroomId", { status: 400 });
  try {
    // Delete the ClassroomUser entry to remove the user from the classroom
    const deleteClassroomUserResult = await db.classroomUser.deleteMany({
      where: {
        classroomId: classroomId,
      },
    });

    if (deleteClassroomUserResult) {
      const deleteResult = await db.classroom.delete({
        where: {
          id: classroomId,
          adminId: session.user.id,
        },
      });

      if (!deleteResult) return new Response("Failed to delete classroom", { status: 500 });
    } else return new Response("Failed to delete classroom", { status: 500 });
    return new Response(JSON.stringify({ message: "Successfully left classroom" }), { status: 200 });
  } catch (error) {
    console.log("DELETE /api/classroom error: ", error);
    return new Response("Failed to leave classroom", { status: 500 });
  }
}

export async function GET(req:Request, { params: { classroomId } }: { params: { classroomId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  try {
    const isUserInClassroom = await db.classroomUser.findFirst({
      where: {
        userId: session.user.id,
        classroomId: classroomId
      }
    })

    if(!isUserInClassroom) return new Response("User is not a member", { status: 401 });

    const classroom = await db.classroom.findUnique({
      where:{
        id : classroomId,
        users: {
          some: {
            userId: session.user.id
          }
        }
      },
      include:{
        subjects: {
          include: {
            documents: true,
          }
        },
        users: true,
        admin: true
      }
    })
    console.log("classroom data", classroom);
    if(!classroom) return new Response("Classroom not found", { status: 404 });
    return new Response(JSON.stringify(classroom), { status: 200 });
  } catch (error) {
    console.log("GET /api/classroom error: ", error);
    return new Response("Failed to get classroom data", { status: 500 });
  }
}
