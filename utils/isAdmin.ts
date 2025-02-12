import { client } from "../src/sanity/lib/client";

export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;

  try {
    const user = await client.fetch(
      `*[_type == "user" && email == "hareemfarooqi2134@gmail.com"]{role}`,
      { email }
    );
    return user?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
