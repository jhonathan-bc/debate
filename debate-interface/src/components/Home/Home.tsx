const Home = ({ onParamChange }: any) => {
  const sendParam = () => {
    const newParam = "Hello from Home!";
    onParamChange(newParam);
  };

  return (
    <div>
      <h2>Home Component</h2>
      <button onClick={sendParam}>Send Parameter</button>
    </div>
  );
};

export default Home;
