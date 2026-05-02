

const IdealWeight = ({ height, bmi }) => {
    const calculateIdealWeightRange = () => {
        const heightCm = parseFloat(height);

        if (!heightCm || heightCm <= 0) return null;

        const heightM = heightCm / 100;

        const minWeight = (18.5 * heightM * heightM).toFixed(1);
        const maxWeight = (24.9 * heightM * heightM).toFixed(1);

        return { minWeight, maxWeight };
    };
    const getWeightSuggestion = () => {
        const bmiCal = parseFloat(bmi);
        const idealRange = calculateIdealWeightRange();

        if (!bmiCal || !idealRange) return null;

        if (bmiCal >= 18.5 && bmiCal <= 24.9) {
            return `✅ Weight is within ideal range. ${idealRange.minWeight} kg - ${idealRange.maxWeight} kg`;
        } else {
            return `⚠️ Ideal weight should be between ${idealRange.minWeight} kg and ${idealRange.maxWeight} kg`;
        }
    };


    // const idealWeightRange = calculateIdealWeightRange();
    return (
        <div>
            <h3>Ideal Weight:</h3>
            {/* <p>{idealWeightRange ? `Between ${idealWeightRange.minWeight} and ${idealWeightRange.maxWeight} kg` : "Height not provided"}</p> */}
            <p>{getWeightSuggestion()}</p>
        </div>
    );
}

export default IdealWeight;