import './viewuserlist.css'
import { useTheme } from "../../../context/ThemeContext";

const cardDataa = [
  { id: 1, title: "Total Deposit", value: 0, img: "https://monet.tairad.com/assets/images/account-file.webp" },
  { id: 2, title: "Total Withdrawal", value: 0, img: "https://monet.tairad.com/assets/images/account-file.webp" },
  { id: 3, title: "Total MT5 Account", value: 0, img: "https://monet.tairad.com/assets/images/account-file.webp" },
];

const Viewusercards = () => {
  const { theme } = useTheme();
  return (



    <div className="userview-dashboard-cards-wrapper d-flex gap-3" >
      {cardDataa.map((card) => (
        <div key={card.id} className={`card-body ${theme === "dark" ? "bg-black text-light" : "bg-white"}`}>
          <img className="user-img" src={card.img} alt="" />
          <h3 className={theme === "dark" ? "text-light" : ""}>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>





  )
}

export default Viewusercards
