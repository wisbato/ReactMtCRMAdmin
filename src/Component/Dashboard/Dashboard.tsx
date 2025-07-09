// Dashboard.tsx
import { useTheme } from '../../context/ThemeContext'
import Chart from './component/Chart'
import Clientlist from './component/Clientlist'
import Dashboardcards from './component/Dashboardcards'
import Depositcard from './component/Depositcard'
import './dashbord.css'

const Dashboard = () => {
    const { theme } = useTheme(); 
    
    return (
        <div className={`dashbord-container ${theme === 'dark' ? 'dark-mode' : ''}`}>
            <h1>Dashboard</h1>
            <div className='dashboard-col'>
                <div className='dashboard-cards-container'>
                    <Dashboardcards/>
                    <Clientlist />
                </div>
                <div>
                </div>
            </div>
            
            <Chart />

            <div className='deposit-card-wrapper'>
                <Depositcard title={'Daily Deposit'} value={'100'} />
                <Depositcard title={'Weekly Deposit'} value={'100'} />
                <Depositcard title={'Monthly Deposit'} value={'100'} />
                <Depositcard title={'Total Deposit'} value={'100'} />
                <Depositcard title={'Daily Withdraw'} value={'100'} />
                <Depositcard title={'Weekly Withdraw'} value={'100'} />
                <Depositcard title={'Monthly Withdraw'} value={'100'} />
                <Depositcard title={'Total Withdraw'} value={'100'} />
                <Depositcard title={'Daily IB Withdraw'} value={'100'} />
                <Depositcard title={'Weekly IB Withdraw'} value={'100'} />
                <Depositcard title={'Monthly IB Withdraw'} value={'100'} />
                <Depositcard title={'Total IB Withdraw'} value={'100'} />
            </div>
        </div>
    )
}

export default Dashboard