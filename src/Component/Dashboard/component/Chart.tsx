// Chart.tsx
import { useState } from "react";
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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart = () => {
  const [activeTab, setActiveTab] = useState<"transaction" | "client">("transaction");

  // Data for Transaction view (1st image)
  const transactionData = {
    labels: ["2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07", "2025-07-08", "2025-07-09"],
    datasets: [
      {
        label: "Deposit",
        data: [0.0015, 0.001, 0.002, 0.001, 0.0015, 0.0005, 0.001],
        borderColor: "#FE6C02",
        backgroundColor: "rgba(254, 108, 2, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Withdraw",
        data: [0.001, 0.0005, 0.0015, 0.0005, 0.001, 0.0005, 0.0005],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "IB Withdraw",
        data: [0.0005, 0.0005, 0.001, 0.0005, 0.0005, 0.0005, 0.0005],
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Data for Client view (2nd image)
  const clientData = {
    labels: ["2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07", "2025-07-08", "2025-07-09"],
    datasets: [
      {
        label: "Client",
        data: [0.0015, 0.001, 0.002, 0.0015, 0.001, 0.0015, 0.002],
        borderColor: "#FE6C02",
        backgroundColor: "rgba(254, 108, 2, 0.2)",
        borderWidth: 2,
        tension: 0.4,
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
        ticks: {
          callback: (value: number) => `${value}K`,
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%", marginBottom: "90px" }}>
      <div className='chart-btn-section'>
        <div className='btn-section'>
          <button 
            onClick={() => setActiveTab("transaction")}
            style={{ 
              backgroundColor: activeTab === "transaction" ? "#FE6C02" : "",
              color: activeTab === "transaction" ? "white" : ""
            }}
          >
            Transaction
          </button>
          <button 
            onClick={() => setActiveTab("client")}
            style={{ 
              backgroundColor: activeTab === "client" ? "#FE6C02" : "",
              color: activeTab === "client" ? "white" : ""
            }}
          >
            Client
          </button>
        </div>
      </div>
      <Line 
        data={activeTab === "transaction" ? transactionData : clientData} 
         
      />
    </div>
  );
};

export default Chart;