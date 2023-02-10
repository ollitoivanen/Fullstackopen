const Total = ({ parts }) => {
  const calculateTotal = () => {
    const total = parts.reduce((s, p) => {
      return s + p.exercises;
    }, 0);
    return total;
  };
  return (
    <p>
      <b>
        {"Number of exercises "}
        {calculateTotal()}
      </b>
    </p>
  );
};

export default Total;
