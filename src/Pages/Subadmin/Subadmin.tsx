import { Outlet } from 'react-router-dom'
import './subadmin.css'
import { useTheme } from "../../context/ThemeContext";
const Subadmin = () => {
  const { theme } = useTheme();
  return (
    <div className={`subadmin-main ${theme === "dark" ? "bg-black" : ""}`}>
        <Outlet/>
      
    </div>
  )
}

export default Subadmin
