import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return new Response("Unauthorised", { status: 401 });
  try {
    const classrooms = await db.classroom.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        admin: true,
        subjects: true,
        users: true,
      }
    });
    if (!classrooms)
      return new Response("No classrooms found", { status: 404 });
    return new Response(JSON.stringify(classrooms), { status: 200 });
  } catch (error) {
    console.log("GET /api/classroom error: ", error);
    return new Response("Failed to fetch classrooms", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorised", { status: 401 });
  if (session.user.access === "STUDENT") {
    return new Response("Unauthorised", { status: 401 });
  }
  try {
    const body = await req.json();
    const { classroomName } = body;
    // Create a classroom and directly associate it with the user based on the session
    // and add the classroom to the user's adminClassrooms list.
    const classroom = await db.classroom.create({
      data: {
        name: classroomName,
        admin: {
          connect: {
            id: session.user.id,
          },
        },
        // Assuming the relation name is "ClassroomAdmin" as per the schema fix
        // This part is not needed explicitly since connecting the admin will automatically
        // link the classroom to the admin's adminClassrooms list due to how Prisma handles relations.
        // The explicit addition would be necessary if you were modifying the User record directly,
        // for example, adding a classroom to an existing list of adminClassrooms without creating a new Classroom.
      },
    });
    await db.classroomUser.create({
      data: {
        userId: session.user.id,
        classroomId: classroom.id
      }
    })

    if (!classroom) return new Response("Failed to create classroom", { status: 500 });

    return new Response(JSON.stringify(classroom), { status: 200 });
  } catch (error) {
    console.log("POST /api/classroom error: ", error);
    return new Response("Failed to create classroom", { status: 500 });
  }
}
