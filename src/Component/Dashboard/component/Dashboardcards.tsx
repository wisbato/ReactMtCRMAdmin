import './dashboardcards.css'
import cardimg1 from '../../../assets/cashdeposit.webp'
import { useTheme } from '../../../context/ThemeContext';
const cardData = [
    { id: 1, title: "Total MT5 Account", value: 0, img: "https://monet.tairad.com/assets/images/account-file.webp" },
    { id: 2, title: "Active MT5 Account", value: 10, img: "https://monet.tairad.com/assets/images/account-file.webp" },
    { id: 3, title: "Closed MT5 Account", value: 5, img: "https://monet.tairad.com/assets/images/account-file.webp" },
    { id: 4, title: "Pending MT5 Account", value: 3, img: "https://monet.tairad.com/assets/images/account-file.webp" },
    { id: 5, title: "Closed MT5 Account", value: 5, img: "https://monet.tairad.com/assets/images/account-file.webp" },
    { id: 6, title: "Pending MT5 Account", value: 3, img: "https://monet.tairad.com/assets/images/account-file.webp" },
  ];
const Dashboardcards = () => {
  const { theme } = useTheme();
  return (
    <div className={`dashboard-cards-wrapper  ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {cardData.map((card) => (
        <div key={card.id} className="card-body">
          <img className="user-img" src={cardimg1} alt="" />
          <h3>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default Dashboardcards
