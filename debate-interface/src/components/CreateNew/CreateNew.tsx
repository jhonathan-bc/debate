import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Debate } from "../../functions/types"; // Ensure types are imported correctly

function CreateNew() {
  const [motion, setMotion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSetMotion = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMotion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDebate: Omit<Debate, "id"> = {
      motion: motion,
      PM: { speech: "", rebuttal: "", POI: "" },
      LO: { speech: "", rebuttal: "", POI: "" },
      DPM: { speech: "", rebuttal: "", POI: "" },
      DLO: { speech: "", rebuttal: "", POI: "" },
      MG: { speech: "", rebuttal: "", POI: "" },
      MO: { speech: "", rebuttal: "", POI: "" },
      GW: { speech: "", rebuttal: "", POI: "" },
      OW: { speech: "", rebuttal: "", POI: "" },
    };

    try {
      const result = await window.electronAPI.createDebate(newDebate); // result should be of type Debate

      if (result && result.id) {
        setSuccess(true);
        setMotion(""); // Clear input on success
        navigate(`/Speech/PM/${result.id}`); // Navigate to the new route
      } else {
        setError("Failed to create debate entry.");
      }
    } catch (error) {
      setError("An error occurred while creating the debate entry.");
      console.error(error);
    }
  };

  return (
    <>
      <h1>מושן</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={motion}
          onChange={handleSetMotion}
          placeholder="הכנס/י מושן"
        />
        <button type="submit">התחל/י דיבייט</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Debate created successfully!</p>
      )}
    </>
  );
}

export default CreateNew;
