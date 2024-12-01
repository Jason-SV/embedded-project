export default async function updatePumpState(username: string, password: string, value: "on" | "off") {
    // Validate topic and value
    if (value !== "off" && value !== "on") {
        throw new Error("Invalid value for topic. Must be 'on' or 'off'.");
    }

    // Simulate delay if necessary
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        // Construct the API URL
        const url = `https://api.netpie.io/v2/device/message?topic=pump`;
        
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
            body: value,
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