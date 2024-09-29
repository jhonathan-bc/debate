import "./Speech.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Debate, SpeakerRole } from "../../functions/types"; // Adjust the import path

const Speech = () => {
  const { speaker: speakerParam, id } = useParams<{
    speaker: SpeakerRole;
    id: string;
  }>();
  const navigate = useNavigate();
  const speaker = speakerParam as SpeakerRole; // Cast to SpeakerRole

  const [speech, setSpeech] = useState<string>("");
  const [rebuttal, setRebuttal] = useState<string>("");
  const [POI, setPOI] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Translation dictionary for speaker roles
  const speakerTranslations: Record<SpeakerRole, string> = {
    PM: "ראש הממשלה",
    LO: 'יו"ר אופוזיציה',
    DPM: "סגן ראש הממשלה",
    DLO: 'סגן יו"ר האופוזיציה',
    MG: "מרחיב הממשלה",
    MO: "מרחיב האופוזיציה",
    GW: "מסכם הממשלה",
    OW: "מסכם האופוזיציה",
  };

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(
          `https://debate-data.onrender.com/debates/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch debate data");
        }
        const debate: Debate = await response.json();
        if (debate) {
          setSpeech(debate[speaker]?.speech || "");
          setRebuttal(debate[speaker]?.rebuttal || "");
          setPOI(debate[speaker]?.POI || "");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDebate();
    } else {
      setError("ID is not available.");
      setLoading(false);
    }
  }, [speaker, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!speech.trim() || !rebuttal.trim() || !POI.trim()) {
    //   alert("Please fill in all fields");
    //   return;
    // }

    if (!id) {
      return; // Handle the case where id is not available
    }

    try {
      // First, fetch the existing debate data
      const response = await fetch(
        `https://debate-data.onrender.com/debates/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch existing debate data");
      }
      const existingDebate: Debate = await response.json();

      // Create the updated debate object
      const updatedDebate: Debate = {
        motion: existingDebate.motion, // Retain the existing motion
        PM: {
          ...existingDebate.PM,
          ...(speaker === "PM" ? { speech, rebuttal, POI } : {}),
        },
        LO: {
          ...existingDebate.LO,
          ...(speaker === "LO" ? { speech, rebuttal, POI } : {}),
        },
        DPM: {
          ...existingDebate.DPM,
          ...(speaker === "DPM" ? { speech, rebuttal, POI } : {}),
        },
        DLO: {
          ...existingDebate.DLO,
          ...(speaker === "DLO" ? { speech, rebuttal, POI } : {}),
        },
        MG: {
          ...existingDebate.MG,
          ...(speaker === "MG" ? { speech, rebuttal, POI } : {}),
        },
        MO: {
          ...existingDebate.MO,
          ...(speaker === "MO" ? { speech, rebuttal, POI } : {}),
        },
        GW: {
          ...existingDebate.GW,
          ...(speaker === "GW" ? { speech, rebuttal, POI } : {}),
        },
        OW: {
          ...existingDebate.OW,
          ...(speaker === "OW" ? { speech, rebuttal, POI } : {}),
        },
        id: id,
      };

      // Now send the updated object back to the server
      const updateResponse = await fetch(
        `https://debate-data.onrender.com/debates/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDebate),
        }
      );

      if (updateResponse.ok) {
        if (speaker === "OW") {
          // Navigate to root if speaker is OW
          navigate("/");
        } else {
          navigateToNextSpeaker(speaker, id);
        }
      } else {
        console.error("Failed to update debate entry.");
        setError("Failed to update debate entry.");
      }
    } catch (error) {
      console.error("Error updating debate entry:", error);
      setError("Error updating debate entry.");
    }
  };

  const navigateToNextSpeaker = (currentSpeaker: SpeakerRole, id: string) => {
    const speakersOrder: SpeakerRole[] = [
      "PM",
      "LO",
      "DPM",
      "DLO",
      "MG",
      "MO",
      "GW",
      "OW",
    ];
    const currentIndex = speakersOrder.indexOf(currentSpeaker);
    const nextIndex = (currentIndex + 1) % speakersOrder.length;
    const nextSpeaker = speakersOrder[nextIndex];

    navigate(`/Speech/${nextSpeaker}/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>נאום {speakerTranslations[speaker]}</h1>{" "}
      {/* Use the translation dictionary */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>טיעונים:</label>
          <textarea
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
            rows={6}
          />
        </div>
        {!(speaker == "PM") && (
          <div>
            <label>ריבטל:</label>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              rows={6}
            />
          </div>
        )}
        <div>
          <label>POI:</label>
          <textarea
            value={POI}
            onChange={(e) => setPOI(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default Speech;
