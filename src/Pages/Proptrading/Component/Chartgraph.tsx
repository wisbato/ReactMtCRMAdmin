import { Card } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { date: '2025-03-20', Deposit: 0, Withdraw: 0, 'IB Withdraw': 0 },
  { date: '2025-03-21', Deposit: 0, Withdraw: 0, 'IB Withdraw': 0 },
  { date: '2025-03-22', Deposit: 0, Withdraw: 0, 'IB Withdraw': 0 },
  { date: '2025-03-23', Deposit: 0, Withdraw: 0, 'IB Withdraw': 0 },
  { date: '2025-03-24', Deposit: 0, Withdraw: 0, 'IB Withdraw': 0 },
  { date: '2025-03-25', Deposit: 0, Withdraw: 0.002, 'IB Withdraw': 0 },
  { date: '2025-03-26', Deposit: 0.002, Withdraw: 0, 'IB Withdraw': 0 }
];

const Chartgraph = () => {
  return (
    <Card className="p-4 shadow">
      <h2 className="text-lg font-semibold mb-2" style={{ fontSize: '18px', fontWeight: '600' }}>
        Number of New Participants
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} minTickGap={5} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="Deposit" stroke="#1E40AF" strokeWidth={2} dot={{ fill: "#1E40AF", r: 5 }} />
          <Line type="monotone" dataKey="Withdraw" stroke="#D32F2F" strokeWidth={2} dot={{ fill: "#D32F2F", r: 5 }} />
          <Line type="monotone" dataKey="IB Withdraw" stroke="#00B8D9" strokeWidth={2} dot={{ fill: "#00B8D9", r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chartgraph;
