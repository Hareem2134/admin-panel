// src/sanity/lib/uploadImage.ts
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/assets/images/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`,
        },
        body: formData,
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error("Sanity API Error:", result);
      throw new Error(result.message || "Failed to upload image");
    }

    return result.document._id;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}