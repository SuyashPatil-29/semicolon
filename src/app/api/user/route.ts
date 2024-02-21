import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    console.log(body)
    return new Response(JSON.stringify(body))
  } catch (error) {
    console.log(error)
    return new Response("Failed to create user", { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { 
        Files : true,
        classrooms : {
          include : {
            classroom : {
              include : {
                subjects : true,
                admin : true,
                users : true,
                _count : {
                  select : {
                    users : true
                  }
                }
              }
            },
            user : true,
          }
        },
        Documents: true,
        Subjects: true
      },
    })

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    const newUser = {
      ...user,
      password: undefined
    }

    return new Response(JSON.stringify(newUser), { status: 200 })
  } catch (error) {
    console.log("GET : /api/user", error)
    return new Response("Error", { status: 500 })
  }
}
