import { useState, useEffect } from "react";
import "./Home.css";
import { Debate } from "../../functions/types";
// import { useElectronAPI } from "../../hooks/useElectronAPI"; // Adjust the path if needed

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  speakers: any[];
}

const DebateGroup: React.FC<DebateGroupProps> = ({ title, speakers }) => (
  <div className="group">
    <h2>{title}</h2>
    {speakers.map((speaker, index) => (
      <div key={index}>
        <h2>{speaker.title}</h2>
        <h3>טיעוני {speaker.title}:</h3>
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Using the electronAPI to fetch debates
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const data = await window.electronAPI.readDebates(); // Fetch data using electronAPI
        setMotions(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load debates");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDebates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedMotion = motions.find(
    (motion) => motion.id === selectedMotionId
  );

  const handleDelete = async (id: string | null) => {
    if (!id) return;

    try {
      await window.electronAPI.deleteDebate(id); // Use electronAPI to delete debate
      console.log(`Deleted debate with ID: ${id}`);
      setMotions(motions.filter((motion) => motion.id !== id)); // Refresh motions
    } catch (error) {
      console.error("Error deleting debate:", error);
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
