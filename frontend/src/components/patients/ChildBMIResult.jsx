const ChildBMIResult = ({ bmi, zScore, status, ageInMonths }) => {

  const getInterpretation = (z) => {
    z = parseFloat(z);

    if (z < -2) return "Underweight: BMI is below normal range for age.";
    if (z >= -2 && z <= 1) return "Normal: BMI is within healthy range.";
    if (z > 1 && z <= 2) return "Overweight: BMI is above normal range.";
    return "Obese: BMI is significantly above normal range.";
  };

  const getColor = (status) => {
    if (status === "Normal") return "green";
    if (status === "Underweight") return "blue";
    if (status === "Overweight") return "orange";
    return "red";
  };

  return (
    <div className="child-bmi-card">
      <h3>Child BMI Assessment</h3>

      <p><strong>Age:</strong> {ageInMonths} months</p>
      <p><strong>BMI:</strong> {bmi}</p>
      <p><strong>Z-Score:</strong> {zScore}</p>

      <p style={{ color: getColor(status) }}>
        <strong>Status:</strong> {status}
      </p>

      <p><strong>Interpretation:</strong> {getInterpretation(zScore)}</p>
    </div>
  );
};

export default ChildBMIResult;