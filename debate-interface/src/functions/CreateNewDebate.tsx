import { Debate } from "./types";

// Update CreateNewDebate to accept an object without the id
export const CreateNewDebate = async (
  debateEntry: Omit<Debate, "id">
): Promise<Debate | undefined> => {
  try {
    const response = await fetch("https://debate-data.onrender.com/debates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(debateEntry),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Response error:", errorMessage);
      throw new Error(`Network response was not ok: ${errorMessage}`);
    }

    const data: Debate = await response.json();
    console.log("Debate entry created:", data);
    return data;
  } catch (error) {
    console.error("Error creating debate entry:", error);
    throw error;
  }
};
