export default async function getNetpieData(username: string, password: string) {
    // Simulate delay if necessary
    await new Promise((resolve) => setTimeout(resolve, 1000));  
  
    try {
      // Construct the API URL
      const url = `https://api.netpie.io/v2/device/shadow/data`;
  
      // Prepare the Basic Auth credentials in base64 format
      const credentials = `${username}:${password}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');
  
      // Fetch data from the Netpie API with Basic Authentication
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        },
        next: { tags: ['netpie'] },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data from Netpie. Status: ${response.status}`);
      }
  
      // Parse and return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error fetching Netpie data:", error);
      throw error;
    }
  }