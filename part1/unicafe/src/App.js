import { useState } from "react";

const Title = () => {
  return <h1>Give Feedback</h1>;
};

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const calculateTotal = () => good + neutral + bad;

  const calculateAvg = () => {
    const value = good - bad;
    const total = calculateTotal();
    return value / total;
  };

  const calculatePositive = () => {
    const total = calculateTotal();
    return (good / total) * 100 + " %";
  };
  if (calculateTotal() === 0) {
    return <p>No feedback given </p>;
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={calculateTotal()} />
        <StatisticLine text="Average" value={calculateAvg()} />
        <StatisticLine text="Positive" value={calculatePositive()} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
  };

  const handleNeutral = () => {
    setNeutral(neutral + 1);
  };
  const handleBad = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <Title />
      <Button handleClick={handleGood} text="Good" />
      <Button handleClick={handleNeutral} text="Neutral" />
      <Button handleClick={handleBad} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
