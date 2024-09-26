import { useState, useEffect } from "react";

interface Speech {
  speech: string;
  rebuttal: string;
  POI: string;
}

interface Debate {
  motion: string;
  PM: Speech;
  LO: Speech;
  DPM: Speech;
  DLO: Speech;
  MG: Speech;
  MO: Speech;
  GW: Speech;
  OW: Speech;
  id: string;
}

const useFetchDebateData = (url: string) => {
  const [data, setData] = useState<Debate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Debate = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchDebateData;
