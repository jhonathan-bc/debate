import { useState, useEffect } from "react";
import useFetchDebateData from "../../functions/useFetchDebateData";
import "./Home.css";

interface Speech {
  speech: string;
  rebuttal: string;
  POI: string;
}

interface Debate {
  motion: string;
  PM: Speech;
  DPM: Speech;
  LO: Speech;
  DLO: Speech;
  MG: Speech;
  GW: Speech;
  MO: Speech;
  OW: Speech;
  id: string;
}

const Home = () => {
  const [motions, setMotions] = useState<Debate[]>([]);
  const [selectedMotionId, setSelectedMotionId] = useState<string | null>(null);

  const { data, loading, error } = useFetchDebateData(
    "http://localhost:8000/debates"
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

  return (
    <div>
      <h1>Select a Debate Motion</h1>
      <select
        onChange={(e) => setSelectedMotionId(e.target.value)}
        value={selectedMotionId || ""}
      >
        <option value="" disabled>
          Select a motion
        </option>
        {motions.map((motion) => (
          <option key={motion.id} value={motion.id}>
            {motion.motion}
          </option>
        ))}
      </select>

      {selectedMotion && (
        <div className="container">
          <div className="column">
            {/* OG Group (PM and DPM) */}
            <div className="group">
              <h2>ממשלה ראשונה</h2>
              <h3>טיעוני רוה"מ:</h3>
              <p>{selectedMotion.PM?.speech || "Speech not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.PM?.POI || "POI not available"}</p>
              <h3>טיעוני סגן רוה"מ:</h3>
              <p>{selectedMotion.DPM?.speech || "Speech not available"}</p>
              <h3>ריבטל סגן רוה"מ:</h3>
              <p>{selectedMotion.DPM?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.DPM?.POI || "POI not available"}</p>
            </div>

            {/* CG Group (MG and GW) */}
            <div className="group">
              <h2>ממשלה שנייה</h2>
              <h3>טיעוני מרחיב ממשלה:</h3>
              <p>{selectedMotion.MG?.speech || "Speech not available"}</p>
              <h3>ריבטל מרחיב ממשלה:</h3>
              <p>{selectedMotion.MG?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.MG?.POI || "POI not available"}</p>
              <h3>טיעוני מסכם ממשלה:</h3>
              <p>{selectedMotion.GW?.speech || "Speech not available"}</p>
              <h3>ריבטל מסכם ממשלה:</h3>
              <p>{selectedMotion.GW?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.GW?.POI || "POI not available"}</p>
            </div>
          </div>

          <div className="column">
            {/* OG Group (LO and DLO) */}
            <div className="group">
              <h2>אופוזיציה ראשונה</h2>
              <h3>טיעוני יו"ר האופוזיציה:</h3>
              <p>{selectedMotion.LO?.speech || "Speech not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.LO?.POI || "POI not available"}</p>
              <h3>טיעוני סגן יו"ר האופוזיציה:</h3>
              <p>{selectedMotion.DLO?.speech || "Speech not available"}</p>
              <h3>ריבטל סגן יו"ר האופוזיציה:</h3>
              <p>{selectedMotion.DLO?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.DLO?.POI || "POI not available"}</p>
            </div>

            {/* CG Group (MO and OW) */}
            <div className="group">
              <h2>אופוזיציה שנייה</h2>
              <h3>טיעוני מרחיב אופוזיציה:</h3>
              <p>{selectedMotion.MO?.speech || "Speech not available"}</p>
              <h3>ריבטל מרחיב אופוזיציה:</h3>
              <p>{selectedMotion.MO?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.MO?.POI || "POI not available"}</p>
              <h3>טיעוני מסכם אופוזיציה:</h3>
              <p>{selectedMotion.OW?.speech || "Speech not available"}</p>
              <h3>ריבטל מסכם אופוזיציה:</h3>
              <p>{selectedMotion.OW?.rebuttal || "rebuttal not available"}</p>
              <h3>POI:</h3>
              <p>{selectedMotion.OW?.POI || "POI not available"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
