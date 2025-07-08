import { div } from 'framer-motion/client'
import Dashboardcard from './Dashboardcard'
import './viewuserlist.css'
import Viewusercards from './Viewusercards'
import Deposittable from './Deposittable'
import Withdrawtable from './Withdrawtable'
import MT5accounttable from './MT5accounttable'
import Bankdetailtable from './Bankdetailtable'
import Loginactivitytable from './Loginactivitytable'
import { JSX, useState } from 'react'
import { useTheme } from "../../../context/ThemeContext";
const Viewuserlist = () => {
    const { theme } = useTheme();
    const [activeComponent, setActiveComponent] = useState<"deposit" | "withdraw" | "mt5" | "bank" | "login">("deposit");
    const components: { [key in "deposit" | "withdraw" | "mt5" | "bank" | "login"]: JSX.Element } = {
        deposit: <Deposittable />,
        withdraw: <Withdrawtable />,
        mt5: <MT5accounttable />,
        bank: <Bankdetailtable />,
        login: <Loginactivitytable />,
    };
    return (
        <div className={`viewuserlist ${theme === "dark" ? "bg-black text-light" : "bg-white"}`}>
            <h1>User Details</h1>
            <div className='viewuserlist-cards'>
                <div className='viewuser-dashboard-cards-wrapper'>
                    <Viewusercards />
                </div>
                
            </div>
            <div className="user-list-btn">
            {/* <button 
                    style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    onClick={() => setActiveComponent("deposit")}
                >
                    Deposit
                </button> */}
                <button className='user-list-btns' style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  onClick={() => setActiveComponent("deposit")}>Deposit</button>
                <button className='user-list-btns' style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  onClick={() => setActiveComponent("withdraw")}>Withdraw</button>
                <button className='user-list-btns' style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  onClick={() => setActiveComponent("mt5")}>MT5 account</button>
                <button className='user-list-btns' style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  onClick={() => setActiveComponent("bank")}>Bank detail</button>
                <button className='user-list-btns' style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  onClick={() => setActiveComponent("login")}>Login activity</button>
            </div>
            <div>{components[activeComponent]}</div>

        </div>


    )
}

export default Viewuserlist
