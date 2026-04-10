import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../api/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Analytics = () => {

  const [data, setData] = useState([]);
  const [range, setRange] = useState(7);

  const fetchAnalytics = async () => {
    const res = await axios.get(`/analytics/appointments?days=${range}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Appointments",
        data: data.map((item) => item.count),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (
    <div>

      <div className="mb-4">
        <button onClick={() => setRange(7)}>7 Days</button>
        <button onClick={() => setRange(30)}>30 Days</button>
      </div>

      <Bar data={chartData} />

    </div>
  );
};

export default Analytics;