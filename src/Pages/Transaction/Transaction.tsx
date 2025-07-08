import { Outlet } from 'react-router-dom'
import './transaction.css'
import { useTheme } from "../../context/ThemeContext";
const Transaction = () => {
  const { theme } = useTheme();
  return (
    <div className={`transaction-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
        <Outlet/>
      
    </div>
  )
}

export default Transaction
