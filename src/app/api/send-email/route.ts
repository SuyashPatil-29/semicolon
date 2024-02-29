import sendEmail from "@/lib/sendMail";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, usn, password, username, confirmPassword, access } = (body);

    const code = Math.floor(100000 + Math.random() * 900000);

    const text = `Thank you for signing up. Your verification code is ${code}. Please do not share this code with anyone.`;
    const subject = `Semicolon - Verification code`;

    const response: any = await sendEmail({
      subject,
      text,
      to: email,
    });

    if (response !== `Message delivered to ${email}`) {
      return new Response(`Could not verify email. Please try again`, { status: 503 });
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
