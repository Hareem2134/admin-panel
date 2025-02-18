import { client } from "../src/sanity/lib/client";

export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;

  try {
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

    if (!adminEmails.includes(email)) return false;

    const user = await client.fetch(
      `*[_type == "user" && email == $email]{role}`,
      { email }
    );
    return user.length > 0 && user[0].role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
