export default async function getBlynkSensors(pin: string) {
  // Simulate delay if necessary
  await new Promise((resolve) => setTimeout(resolve, 1000));  

  // Ensure the Blynk Auth Token is available
  const authToken = process.env.NEXT_PUBLIC_BLYNK_AUTH_TOKEN;
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
  