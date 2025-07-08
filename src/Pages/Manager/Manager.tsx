import { Outlet } from 'react-router-dom'
import './manager.css'
const Manager = () => {
  return (
    <div className='manager-main'>
        <Outlet/>
      
    </div>
  )
}

export default Manager
