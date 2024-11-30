export default async function updatePumpState(username: string, password: string, value: "ON" | "OFF") {
    // Validate topic and value
    if (value !== "OFF" && value !== "ON") {
        throw new Error("Invalid value for topic. Must be 'ON' or 'OFF'.");
    }

    // Simulate delay if necessary
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        // Construct the API URL
        const url = `https://api.netpie.io/v2/device/message?topic=${value}`;
        
        // Prepare the Basic Auth credentials in base64 format
        const credentials = `${username}:${password}`;
        const encodedCredentials = Buffer.from(credentials).toString('base64');

        // Send PUT request to the Netpie API with Basic Authentication
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json',
            },
            next: { tags: ['netpie'] },
        });

        if (!response.ok) {
            throw new Error(`Failed to update Netpie device data. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating Netpie device data:", error);
        throw error;
    }
}