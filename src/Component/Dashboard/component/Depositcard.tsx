import './deposit.css';
import { useTheme } from "../../../context/ThemeContext";

interface DepositCardProps {
  title: string;
  value: number | string;
}

const Depositcard = ({ title, value }: DepositCardProps) => {
  const { theme } = useTheme();
  return (
    <div className={`deposit-dashboard-cards-wrapper ${theme === "dark" ? "text-light" : ""}`}>
      <div className="card-body">
        <h3 className={theme === "dark" ? "text-light" : ""}>{title}</h3>
        <p>{value}</p>
      </div>      
    </div>
  );
};

export default Depositcard;
