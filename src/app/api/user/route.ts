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
