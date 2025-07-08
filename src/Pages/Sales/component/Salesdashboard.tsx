import './salesdashboard.css';
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { SiAmazonsimpleemailservice } from 'react-icons/si';
import Dashboardtable from './Dashboardtable';

const data = [
    { name: "hello", value: 1 },
    { name: "test", value: 1 },
];

const COLORS = ["#DC3545", "#1E40AF"]; 

// Custom Tooltip with Smooth Sliding Effect
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    const isLeft = payload[0].name === "test";

    return (
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }} 
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isLeft ? -20 : 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="custom-tooltip"
        style={{
          backgroundColor: isLeft ? "#DC3545" : "#1E40AF",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "5px",
          position: "absolute",
          transform: `translate(${isLeft ? "-50px" : "50px"}, -10px)`,
          whiteSpace: "nowrap",
        }}
      >
        <strong>{payload[0].name}:</strong> {payload[0].value} leads
      </motion.div>
    );
  }
  return null;
};

const Salesdashboard = () => {
  return (
    <div className='sales-dashboard'>
      <div className="p-6 bg-white shadow-md rounded-lg " style={{borderRadius:'8px'}}>
        <h2 className="text-xl font-semibold mb-4">Sale Dashboard</h2>
        <div className='pie-chart-wrapper'>

        <div className="flex justify-center relative ">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </div>
        </div>
      </div>
      <div className='sales-dashboard-table-container'>
        <Dashboardtable/>
        

      </div>
    </div>
  );
};

export default Salesdashboard;
