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
                    {/* <Dashboardcard />
                    <Dashboardcard />
                    <Dashboardcard />
                    <Dashboardcard />
                    */}
                    <Dashboardcards/>

                    <Clientlist />
                </div>
                <div>
                </div>
            </div>
            <div className='chart-btn-section'>
                <div className='btn-section'>
                    <button>Transaction</button>
                    <button>Client</button>
                </div>

                <Chart />
            </div>



            <div className='deposit-card-wrapper'>

            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />
            <Depositcard title={'Deposit'} value={'100'} />

            <Depositcard title={'Deposit'} value={'100'} />




            </div>
        </div>
    )
}

export default Dashboard
