export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
  
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
  
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
  
    const result = await response.json();
    return result.document._id; // Return uploaded image ID
  }
  