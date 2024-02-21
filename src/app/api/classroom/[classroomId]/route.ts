import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { useSearchParams } from "next/navigation";

export async function PUT(req: Request) {
  const { classroomId, userId } = await req.json();
  try {
    // Create a ClassroomUser entry to associate the user with the classroom
    const classroomUser = await db.classroomUser.create({
      data: {
        userId: userId,
        classroomId: classroomId,
      },
    });

    if (!classroomUser) return new Response("Failed to join classroom", { status: 500 });
    return new Response(JSON.stringify({ message: "Successfully joined classroom" }), { status: 200 });
  } catch (error) {
    console.log("PUT /api/classroom error: ", error);
    return new Response("Failed to join classroom", { status: 500 });
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