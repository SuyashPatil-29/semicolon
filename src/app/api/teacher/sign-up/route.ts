import { db } from "@/lib/db";
import { SignUpValidator } from "@/lib/validators/SignUpValidator";
import { access } from "@prisma/client";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, usn, password, confirmPassword, email } =
      SignUpValidator.parse(body);

    console.log("username", username);

    const existingUserByUsn = await db.user.findFirst({
      where: {
        usn,
      },
    });

    const existingUserByUsername = await db.user.findFirst({
      where: {
        name: username,
      },
    });

    if (existingUserByUsn) {
      return new Response("Account with USN already exists. Login instead", { status: 409 });
    }

    if (existingUserByUsername) {
      return new Response("Account with username already exists. Login instead", { status: 409 });
    }

    if (password !== confirmPassword) {
      return new Response("Passwords do not match", { status: 422 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: {
        name: username,
        usn,
        password: hashedPassword,
        access: access.TEACHER,
        email,
        otp: "",
      },
    });

    const newUser = {
      id: user.id,
      name: user.name,
      usn: user.usn,
      access: user.access,
      email: user.email
    };

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create user", { status: 500 });
  }
}

