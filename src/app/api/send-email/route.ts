import { db } from "@/lib/db";
import sendEmail from "@/lib/sendMail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, usn, password, username, confirmPassword, access } = body;

    if (password !== confirmPassword) {
      return new Response("Passwords do not match", { status: 400 });
    }

    const checkIfUserExists = async (usn: string, name: string) => {
      const userExistsByUSN = await db.user.findFirst({
        where: {
          usn,
        },
      });

      const userExistsByName = await db.user.findFirst({
        where: {
          name,
        },
      });

      if (userExistsByUSN || userExistsByName) return true;
      return false;
    };

    if (await checkIfUserExists(usn, username)) {
      return new Response("User already exists", { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000);

    const text = `Thank you for signing up. Your verification code is ${code}. Please do not share this code with anyone.`;
    const subject = `Semicolon - Verification code`;

    const response: any = await sendEmail({
      subject,
      text,
      to: email,
    });

    if (response !== `Message delivered to ${email}`) {
      return new Response(`Could not verify email. Please try again`, {
        status: 503,
      });
    }

    const user = {
      email,
      usn,
      username,
      password,
      code,
      confirmPassword,
      access,
    };

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
