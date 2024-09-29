import { useState, useEffect } from "react";
import useFetchDebateData from "../../functions/useFetchDebateData";
import "./Home.css";
import { Debate } from "../../functions/types";

const formatText = (text: string) => {
  if (!text) return "Speech not available";

  const parts = text.split(/(\*.*?\*|\$.*?\$)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={index} style={{ fontWeight: "bold", color: "red" }}>
          {part.slice(1, -1)}
        </span>
      );
    } else if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <span key={index} style={{ color: "blue", fontWeight: "bold" }}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

interface DebateGroupProps {
  title: string;
  speakers: any[];
}

const DebateGroup: React.FC<DebateGroupProps> = ({ title, speakers }) => (
  <div className="group">
    <h2>{title}</h2>
    {speakers.map((speaker, index) => (
      <div key={index}>
        <h2>{speaker.title}</h2>
        <h3>טיעוני {speaker.title}</h3>
        <p>{formatText(speaker.speech)}</p>
        {speaker.rebuttal && (
          <>
            <h3>ריבטל {speaker.title}:</h3>
            <p>{formatText(speaker.rebuttal)}</p>
          </>
        )}

        <h3>POI:</h3>
        <p>{formatText(speaker.POI)}</p>
      </div>
    ))}
  </div>
);

const Home = () => {
  const [motions, setMotions] = useState<Debate[]>([]);
  const [selectedMotionId, setSelectedMotionId] = useState<string | null>(null);

  const { data, loading, error } = useFetchDebateData(
    "https://debate-data.onrender.com/debates"
  );

  useEffect(() => {
    if (data) {
      setMotions(data as unknown as Debate[]);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedMotion = motions.find(
    (motion) => motion.id === selectedMotionId
  );

  const handleDelete = async (id: string | null) => {
    if (!id) return;

    try {
      const response = await fetch(
        `https://debate-data.onrender.com/debates/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(`Deleted debate with ID: ${id}`);
      setMotions(motions.filter((motion) => motion.id !== id)); // Refresh motions
    } catch (error) {
      console.error("Error deleting debate:", error);
    }
  };

  const downloadData = async (
    url: string | URL | Request,
    fileName: string
  ) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const urlBlob = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>בחר/י מושן</h1>
      <select
        onChange={(e) => setSelectedMotionId(e.target.value)}
        value={selectedMotionId || ""}
      >
        <option value="" disabled>
          בחר/י מושן
        </option>
        {motions.map((motion) => (
          <option key={motion.id} value={motion.id}>
            {motion.motion}
          </option>
        ))}
      </select>
      <div>
        <button onClick={() => handleDelete(selectedMotionId)}>
          מחק/י מושן
        </button>
        <button
          onClick={() =>
            downloadData("https://debate-data.onrender.com/debates", "db.json")
          }
        >
          שמור מידע
        </button>
      </div>

      {selectedMotion && (
        <div className="container">
          <div className="column">
            <DebateGroup
              title="ממשלה ראשונה"
              speakers={[
                {
                  title: 'רוה"מ',
                  speech: selectedMotion.PM?.speech,
                  POI: selectedMotion.PM?.POI,
                },
                {
                  title: 'סגן רוה"מ',
                  speech: selectedMotion.DPM?.speech,
                  POI: selectedMotion.DPM?.POI,
                  rebuttal: selectedMotion.DPM?.rebuttal,
                },
              ]}
            />
            <DebateGroup
              title="ממשלה שנייה"
              speakers={[
                {
                  title: "מרחיב ממשלה",
                  speech: selectedMotion.MG?.speech,
                  POI: selectedMotion.MG?.POI,
                  rebuttal: selectedMotion.MG?.rebuttal,
                },
                {
                  title: "מסכם ממשלה",
                  speech: selectedMotion.GW?.speech,
                  rebuttal: selectedMotion.GW?.rebuttal,
                  POI: selectedMotion.GW?.POI,
                },
              ]}
            />
          </div>

          <div className="column">
            <DebateGroup
              title="אופוזיציה ראשונה"
              speakers={[
                {
                  title: 'יו"ר האופוזיציה',
                  speech: selectedMotion.LO?.speech,
                  rebuttal: selectedMotion.LO?.rebuttal,
                  POI: selectedMotion.LO?.POI,
                },
                {
                  title: 'סגן יו"ר האופוזיציה',
                  speech: selectedMotion.DLO?.speech,
                  rebuttal: selectedMotion.DLO?.rebuttal,
                  POI: selectedMotion.DLO?.POI,
                },
              ]}
            />
            <DebateGroup
              title="אופוזיציה שנייה"
              speakers={[
                {
                  title: "מרחיב אופוזיציה",
                  speech: selectedMotion.MO?.speech,
                  rebuttal: selectedMotion.MO?.rebuttal,
                  POI: selectedMotion.MO?.POI,
                },
                {
                  title: "מסכם אופוזיציה",
                  speech: selectedMotion.OW?.speech,
                  rebuttal: selectedMotion.OW?.rebuttal,
                  POI: selectedMotion.OW?.POI,
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
