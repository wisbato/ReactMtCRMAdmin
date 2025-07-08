import { Outlet } from 'react-router-dom'
import './groupmanagement.css'
import { useTheme } from "../../context/ThemeContext";
const Groupmanagement = () => {
  const { theme } = useTheme();
  return (
    <div className={`groupmanagement-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
        <Outlet/>
      
    </div>
  )
}

export default Groupmanagement
