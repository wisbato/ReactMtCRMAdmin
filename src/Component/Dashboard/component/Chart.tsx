import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [10, 20, 15, 30, 25, 40],
        borderColor: "#FE6C02",
        backgroundColor: "rgba(254, 108, 2, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#FE6C02",
        pointBorderColor: "#fff",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}> {/* Ensure fixed height */}
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
