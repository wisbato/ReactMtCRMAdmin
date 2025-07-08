import { Outlet } from 'react-router-dom'
import './bonus.css'
import { useTheme } from "../../context/ThemeContext";
const Bonus = () => {
  const { theme } = useTheme();
  return (
    <div className={`bonus-wrapper ${theme === "dark" ? "bg-black" : ""}`} >
        <Outlet/>
      
    </div>
  )
}

export default Bonus
