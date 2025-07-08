import { Outlet } from 'react-router-dom'
import './settings.css'
import { useTheme } from "../../context/ThemeContext";
const Settings = () => {
  const { theme } = useTheme();
  return (
    <div className={`settings-main ${theme === "dark" ? "bg-black" : ""}`}>
        <Outlet/>
      
    </div>
  )
}

export default Settings
