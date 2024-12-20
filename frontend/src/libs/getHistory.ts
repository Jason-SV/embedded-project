export default async function getItems() {
    const url = "http://localhost:4000/api/items"; 
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error; // Re-throw the error to be caught in the component
    }
  }