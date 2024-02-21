import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request, { params: { classroomId } }: { params: { classroomId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!classroomId) return new Response("Missing classroomId", { status: 400 });
  try {
    // Delete the ClassroomUser entry to remove the user from the classroom
    const deleteResult = await db.classroomUser.delete({
      where: {
        userId_classroomId: {
          userId: session.user.id,
          classroomId: classroomId,
        },
      },
    });

    if (!deleteResult) return new Response("Failed to leave classroom", { status: 500 });
    return new Response(JSON.stringify({ message: "Successfully left classroom" }), { status: 200 });
  } catch (error) {
    console.log("DELETE /api/classroom error: ", error);
    return new Response("Failed to leave classroom", { status: 500 });
  }
}
