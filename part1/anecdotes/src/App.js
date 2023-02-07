import { useState } from "react";

const Title = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const randomAnecdote = () => {
    const index = Math.floor(Math.random() * anecdotes.length);
    setSelected(index);
  };

  const voteForAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const calculateMostVoted = () => {
    const max = Math.max(...votes);
    const index = votes.indexOf(max);
    return `${anecdotes[index]} Has ${max} votes`;
  };

  return (
    <div>
      <Title text={"Anecdote of the day"} />
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected]} votes</p>

      <Button text="Get new anecdote" handleClick={randomAnecdote} />
      <Button text="Vote for this anecdote" handleClick={voteForAnecdote} />

      <Title text={"Most voted anecdote"} />
      <p>{calculateMostVoted()}</p>
    </div>
  );
};

export default App;
