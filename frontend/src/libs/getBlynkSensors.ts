export default async function getBlynkSensors(pin: string) {
  // Simulate delay if necessary
  await new Promise((resolve) => setTimeout(resolve, 1000));  

  // Ensure the Blynk Auth Token is available
  const authToken = process.env.NEXT_PUBLIC_BLYNK_AUTH_TOKEN;
  console.log(authToken);
  if (!authToken) {
    throw new Error("Blynk Auth Token is not defined in the environment variables.");
  }

  try {
    // Construct the API URL dynamically using the input pin
    const url = `https://blynk.cloud/external/api/get?token=${authToken}&${pin}`;

    // Fetch data from Blynk Cloud
    const response = await fetch(url, { next: { tags: ["blynk"] } });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Blynk. Status: ${response.status}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error fetching Blynk sensor data:", error);
    throw error;
  }
}
// libs/getBlynkSensors.ts

// export default async function getBlynkSensors(pin: string): Promise<number> {
//   // Simulate delay if necessary
//   await new Promise((resolve) => setTimeout(resolve, 1000));  

//   const authToken = process.env.NEXT_PUBLIC_BLYNK_AUTH_TOKEN;

//   try {
//     // Construct the API URL dynamically using the input pin
//     const url = `https://blynk.cloud/external/api/get?token=${authToken}&${pin}`;

//     // Fetch data from Blynk Cloud
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch data from Blynk. Status: ${response.status}`);
//     }

//     // Parse and return the response as a number
//     const data = await response.text();
//     const value = parseFloat(data);
//     if (isNaN(value)) {
//       throw new Error(`Invalid data received for pin ${pin}: ${data}`);
//     }
//     return value;
//   } catch (error) {
//     console.error("Error fetching Blynk sensor data:", error);
//     throw error;
//   }
// }