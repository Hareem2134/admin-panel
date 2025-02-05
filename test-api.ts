// test-api.ts
const createProduct = async () => {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/mutate/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: "food",
                name: "Test Product",
                price: 10,
              },
            },
          ],
        }),
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      throw new Error("Failed to create product");
    }
  
    const result = await response.json();
    console.log("API Result:", result);
    return result;
  };
  
  // Call the function to test
  createProduct();