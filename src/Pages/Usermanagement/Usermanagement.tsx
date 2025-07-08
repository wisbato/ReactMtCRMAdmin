
import { Outlet } from 'react-router-dom'
import './usermanagement.css'
import { useTheme } from '../../context/ThemeContext';

const Usermanagement = () => {
  const { theme } = useTheme();
  return (
    <div className={`usermanagement-wrapper ${theme === 'dark' ? 'dark-mode' : ''}`}>
        {/* <Adduser/>
        <Userlist/> */}
        <Outlet/>
      
    </div>
  )
}

export default Usermanagement
