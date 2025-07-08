import { Outlet } from 'react-router-dom'
import './allreporter.css'
import Sidebar from '../../Component/Sidebar/Sidebar'
const Allreport = () => {
  return (
    <div>
      <Sidebar isOpen={false} toggleSidebar={function (): void {
        throw new Error('Function not implemented.')
      } } />
      <div className="all-report-content">
        {/* Your main page content goes here */}
        <Outlet /> {/* If using React Router */}
      </div>
    </div>
  )
}

export default Allreport
