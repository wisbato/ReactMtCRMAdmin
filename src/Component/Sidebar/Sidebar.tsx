import "./sidebar.css";
import logo from "../../assets/wealth-logo.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faChartPie,
  faUsers,
  faGift,
  faMinus,
  faEnvelope,
  faNewspaper,
  faGears,
  faUserTie,
  faBars,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../context/ThemeContext";
import useCan from "../../../src/hooks/useCan";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isGroupManagementOpen, setIsGroupManagementOpen] = useState(false);
  const [isIbManagementOpen, setIsIbManagementOpen] = useState(false);
  const [isBonusOpen, setIsBonusOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isAllreport, setIsAllreport] = useState(false);
  const [issetting, setIsSetting] = useState(false);
  const [issubadmin, setIssubadmin] = useState(false);
  const [ismanager, setIsManager] = useState(false);
  const [isproptrading, setIsProptrading] = useState(false);
  // Controls sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const can= useCan();

  const handleItemClick = (item: string, path: string) => {
    setSelectedItem(item);
    navigate(path);

    if (item === "User Management") {
      setIsUserManagementOpen(!isUserManagementOpen);
    }
    if (item === "Bonus") {
      setIsBonusOpen(!isBonusOpen);
    }
  };

  const handleGroupManagementClick = () => {
    setIsGroupManagementOpen(!isGroupManagementOpen);
  };

  const handleTransactionClick = () => {
    setIsTransactionOpen(!isTransactionOpen);
  };

  const handleSalesClick = () => {
    setIsSalesOpen(!isSalesOpen);
  };

  const handleAllreportClick = () => {
    setIsAllreport(!isAllreport);
  };

  const handleSettingClick = () => {
    setIsSetting(!issetting);
  };

  const handleSubadminClick = () => {
    setIssubadmin(!issubadmin);
  };

  const handleManagerClick = () => {
    setIsManager(!ismanager);
  };

  const handleProptradingClick = () => {
    setIsProptrading(!isproptrading);
  };

  // Toggle sidebar function
  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  const { theme } = useTheme();

  return (
    <div
      className={`sidebar-container ${isOpen ? "" : "collapsed"} ${
        theme === "dark" ? "dark-mode" : ""
      }`}
    >
      <div className={`sidebar-logo1 ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <img className={`sidebar-logo ${theme === 'dark' ? 'dark-mode' : ''}`} src={logo} alt="logo" />
        <button
          style={{ border: "none", background: "none" }}
          type="button"
          onClick={handleSidebarToggle}
          className="collapse-icon flex h-8 w-8 items-center justify-center rounded-full border-none transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
          aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faAngleLeft : faAngleRight} size="xl" />
        </button>
      </div>
      <div className="sidebar-menu">
        <ul>
          {/* Dashboard */}
          <li
            className={`icons ${
              selectedItem === "dashboard" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("dashboard", "/dashboard")}
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faChartPie} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Dashboard</span>
            </div>{" "}
          </li>

          {/* User Management */}
          <li
            className={`icons ${
              selectedItem === "User Management" ? "selected" : ""
            }`}
            onClick={() => setIsUserManagementOpen(!isUserManagementOpen)}
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faUsers} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Usermanagement</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isUserManagementOpen && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {
                can('add_user') && <li
                className={`sub-icons ${
                  selectedItem === "add-user" ? "selected" : "" 
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("add-user", "/usermanagement/add-user")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />{" "}
                Add User
              </li>
              }
              
              { can('user_list') && <li
                className={`sub-icons ${
                  selectedItem === "userlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("userlist", "/usermanagement/userlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                User List
              </li> }

              { can('create_mt5_account') && <li
                className={`sub-icons ${
                  selectedItem === "mt5account" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("mt5account", "/usermanagement/mt5account")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Create MT5 Account
              </li> }
              { can('mt5_user_list') && <li
                className={`sub-icons ${
                  selectedItem === "mt5userlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("mt5userlist", "/usermanagement/mt5userlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                MT5 User List
              </li>}
              { can('crm_mt5_user_list') && <li
                className={`sub-icons ${
                  selectedItem === "crmmt5userlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "crmmt5userlist",
                    "/usermanagement/crmmt5userlist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                CRM MT5 User List
              </li>}
              {/* { can('follow_up_list') && <li
                className={`sub-icons ${
                  selectedItem === "followuplist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "followuplist",
                    "/usermanagement/followuplist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Follow Up List
              </li>} */}
              { can('pending_documents_list') && <li
                className={`sub-icons ${
                  selectedItem === "pendingdocumentlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "pendingdocumentlist",
                    "/usermanagement/pendingdocumentlist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Pending Document List
              </li>}
              { can('approved_documents_list') && <li
                className={`sub-icons ${
                  selectedItem === "approveddocument" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "approveddocument",
                    "/usermanagement/approveddocument"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Approved Document List
              </li>}
              { can('upload_user_documents') && <li
                className={`sub-icons ${
                  selectedItem === "aploaduserdocument" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "aploaduserdocument",
                    "/usermanagement/aploaduserdocument"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Upload User Document
              </li>}
              { can('add_bank_details') && <li
                className={`sub-icons ${
                  selectedItem === "addbankdetails" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "addbankdetails",
                    "/usermanagement/addbankdetails"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />{" "}
                Add Bank Details
              </li>}
              { can('bank_details_list') && <li
                className={`sub-icons ${
                  selectedItem === "bankdetailslist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "bankdetailslist",
                    "/usermanagement/bankdetailslist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Bank Detail List
              </li>}
              {/* { can('user_password_list') && <li
                className={`sub-icons ${
                  selectedItem === "userpasswordlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "userpasswordlist",
                    "/usermanagement/userpasswordlist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                User Password List
              </li>} */}
              { can('change_user_password') && <li
                className={`sub-icons ${
                  selectedItem === "changepassword" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "changepassword",
                    "/usermanagement/changepassword"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Change User Password
              </li>}
              { can('add_existing_client') && <li
                className={`sub-icons ${
                  selectedItem === "addexistingclient" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "addexistingclient",
                    "/usermanagement/addexistingclient"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Add Existing Client
              </li>}
              { can('change_mt5_password') && <li
                className={`sub-icons ${
                  selectedItem === "changemt5password" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "changemt5password",
                    "/usermanagement/changemt5password"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Change MT5 Password
              </li>}
              { can('update_mt5_leverage') && <li
                className={`sub-icons ${
                  selectedItem === "updatemt5leverage" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "updatemt5leverage",
                    "/usermanagement/updatemt5leverage"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Update MT5 Leverage
              </li>}
              {/* { can('resend_mt5_data_mail') && <li
                className={`sub-icons ${
                  selectedItem === "givebonus" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("givebonus", "/usermanagement/givebonus")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Resend MT5 Data Mail
              </li>} */}
            </ul>
          )}

          {/* Bonus Section */}
          <li
            className={`icons ${selectedItem === "Bonus" ? "selected" : ""}`}
            onClick={() => setIsBonusOpen(!isBonusOpen)} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Bonus</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isBonusOpen && ( // ✅ Corrected this condition
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              { can('give_bonus') && <li
                className={`sub-icons ${
                  selectedItem === "givebonus" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() => handleItemClick("givebonus", "/bonus/givebonus")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Give Bonus
              </li>}
              { can('remove_bonus') && <li
                className={`sub-icons ${
                  selectedItem === "removebonus" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("removebonus", "/bonus/removebonus")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Remove Bonus
              </li>}
              { can('bonus_list') && <li
                className={`sub-icons ${
                  selectedItem === "bonuslist" ? "selected" : ""
                }`}
                onClick={() => handleItemClick("bonuslist", "/bonus/bonuslist")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Bonus List
              </li>}
            </ul>
          )}

          {/* IB management */}
          {/* <li
            className={`icons ${
              selectedItem === "ibmanagement" ? "selected" : ""
            }`}
            onClick={() => setIsIbManagementOpen(!isIbManagementOpen)} // Use correct state
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>IB Management</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li> */}

          {/* Use the correct state here */}
          {/* {isIbManagementOpen && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              { can('ib_users') && <li
                className={`sub-icons ${
                  selectedItem === "ibusers" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("ibusers", "/ibmanagement/ibusers")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                IB Users
              </li>}
              { can('ib_requests') && <li
                className={`sub-icons ${
                  selectedItem === "ibrequests" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("ibrequests", "/ibmanagement/ibrequests")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                IB Requests
              </li>}
              { can('ib_plan') && <li
                className={`sub-icons ${
                  selectedItem === "ibplan" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("ibplan", "/ibmanagement/ibplan")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                IB Plan
              </li>}
              { can('commission_group') && <li
                className={`sub-icons ${
                  selectedItem === "commissiongroup" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "commissiongroup",
                    "/ibmanagement/commissiongroup"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Commission Group
              </li>}
              { can('set_ib_commission') && <li
                className={`sub-icons ${
                  selectedItem === "setibcommission" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "setibcommission",
                    "/ibmanagement/setibcommission"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Set IB Commission
              </li>}
              { can('move_client_to_ib') && <li
                className={`sub-icons ${
                  selectedItem === "moveclienttoib" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "moveclienttoib",
                    "/ibmanagement/moveclienttoib"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Move Client To IB
              </li>}
              { can('remove_client_from_ib') && <li
                className={`sub-icons ${
                  selectedItem === "removeclientfromib" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "removeclientfromib",
                    "/ibmanagement/removeclientfromib"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Remove Client From IB
              </li>}
              { can('symbol_and_types') && <li
                className={`sub-icons ${
                  selectedItem === "symbolandtype" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "symbolandtype",
                    "/ibmanagement/symbolandtype"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Symbol And Types
              </li>}
              { can('flexible_commissions') && <li
                className={`sub-icons ${
                  selectedItem === "flexiblecommission" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "flexiblecommission",
                    "/ibmanagement/flexiblecommission"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Flexible Commissions
              </li>}
              { can('sync_deal') && <li
                className={`sub-icons ${
                  selectedItem === "syncdeal" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("syncdeal", "/ibmanagement/syncdeal")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Sync Deal
              </li>}
            </ul>
          )} */}

          {/* Bonus Section */}
          <li
            className={`icons ${selectedItem === "Bonus" ? "selected" : ""}`}
            onClick={handleGroupManagementClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Group Management</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isGroupManagementOpen && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              { can('add_group') && <li
                className={`sub-icons ${
                  selectedItem === "addgroup" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("addgroup", "/groupmanagement/addgroup")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Add Group
              </li>}
              { can('group_list') && <li
                className={`sub-icons ${
                  selectedItem === "grouplist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("grouplist", "/groupmanagement/grouplist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Group List
              </li>}
              { can('update_mt5_group') && <li
                className={`sub-icons ${
                  selectedItem === "updatemt5group" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "updatemt5group",
                    "/groupmanagement/updatemt5group"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Update MT5 Group
              </li>}
            </ul>
          )}

          {/* Bonus Section */}
          <li
            className={`icons ${selectedItem === "Bonus" ? "selected" : ""}`}
            onClick={handleTransactionClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Transaction</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isTransactionOpen && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {can('client_deposit') && <li
                className={`sub-icons ${
                  selectedItem === "clientdeposit" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("clientdeposit", "/transaction/clientdeposit")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Client Deposit
              </li>}
              {can('client_withdraw') && <li
                className={`sub-icons ${
                  selectedItem === "clientwithdrawal" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "clientwithdrawal",
                    "/transaction/clientwithdrawal"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Client Withdrawal
              </li>}
              {can('wallet_transaction') && <li
                className={`sub-icons ${
                  selectedItem === "wallettransaction" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "wallettransaction",
                    "/transaction/wallettransaction"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Wallet Transaction
              </li>}
              {/* {can('ib_withdraw') && <li
                className={`sub-icons ${
                  selectedItem === "ibwithdraw" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("ibwithdraw", "/transaction/ibwithdraw")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                IB Withdraw
              </li>} */}
              {can('internal_transfer') && <li
                className={`sub-icons ${
                  selectedItem === "internaltransfer" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "internaltransfer",
                    "/transaction/internaltransfer"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Internal Transfer
              </li>}
              {can('pending_deposit') && <li
                className={`sub-icons ${
                  selectedItem === "pendingdeposit" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "pendingdeposit",
                    "/transaction/pendingdeposit"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Pending Deposit
              </li>}
              {can('pending_withdraw') && <li
                className={`sub-icons ${
                  selectedItem === "pendingwithdraw" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "pendingwithdraw",
                    "/transaction/pendingwithdraw"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Pending Withdraw
              </li>}
              {can('pending_ib_withdraw') && <li
                className={`sub-icons ${
                  selectedItem === "pendingibwithdraw" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "pendingibwithdraw",
                    "/transaction/pendingibwithdraw"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Pending IB Withdraw
              </li>}
            </ul>
          )}

          {/* sales*/}
          {/* <li
            className={`icons ${selectedItem === "Bonus" ? "selected" : ""}`}
            onClick={handleSalesClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Sales</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isSalesOpen && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {can('sales_dashboard') && <li
                className={`sub-icons ${
                  selectedItem === "salesdashboard" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("salesdashboard", "/sales/salesdashboard")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Sales Dashboard
              </li>}
              {can('add_sales') && <li
                className={`sub-icons ${
                  selectedItem === "addsale" ? "selected" : ""
                }`}
                onClick={() => handleItemClick("addsale", "/sales/addsale")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Add Sales
              </li>}
              {can('sales_list') && <li
                className={`sub-icons ${
                  selectedItem === "saleslist" ? "selected" : ""
                }`}
                onClick={() => handleItemClick("saleslist", "/sales/saleslist")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Sales List
              </li>}
              {can('lead_status') && <li
                className={`sub-icons ${
                  selectedItem === "leadstatus" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("leadstatus", "/sales/leadstatus")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Lead Status
              </li>}
              {can('lead_source') && <li
                className={`sub-icons ${
                  selectedItem === "leadsource" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("leadsource", "/sales/leadsource")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Lead Source
              </li>}
              {can('lead_list') && <li
                className={`sub-icons ${
                  selectedItem === "leadlist" ? "selected" : ""
                }`}
                onClick={() => handleItemClick("leadlist", "/sales/leadlist")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Lead List
              </li>}
            </ul>
          )} */}

          {/* email*/}
          {can('send_email') && <li
            className={`icons ${selectedItem === "Email" ? "selected" : ""}`}
            onClick={() => setSelectedItem("Email")} // Update selected item state
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faEnvelope} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <Link
                to="/email"
                style={{ textDecoration: "none", color: theme === "dark" ? "white":"black" }}
              >
                <span>Email</span>
              </Link>
            </div>
          </li>}

          {/* news*/}
          {can('news_list') && <li
            className={`icons ${selectedItem === "News" ? "selected" : ""}`}
            onClick={() => setSelectedItem("Email")} // Update selected item state
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faNewspaper} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <Link
                to="/news"
                style={{ textDecoration: "none", color: theme === "dark" ? "white":"black" }}
              >
                <span>News</span>
              </Link>
            </div>
          </li>}

          {/* notifications*/}
          <li
            className={`icons ${
              selectedItem === "Notifications" ? "selected" : ""
            }`}
            onClick={() => setSelectedItem("Email")} // Update selected item state
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faNewspaper} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <Link
                to="/notifications"
                style={{ textDecoration: "none", color: theme === "dark" ? "white":"black" }}
              >
                <span>Notifications</span>
              </Link>
            </div>
          </li>

          {/* all report*/}
          <li
            className={`icons ${
              selectedItem === "Allreport" ? "selected" : ""
            }`}
            onClick={handleAllreportClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            <FontAwesomeIcon icon={faGift} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>All Report</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>

          {isAllreport && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {can('deposit_report') && <li
                className={`sub-icons ${
                  selectedItem === "depositreport" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("depositreport", "/allreport/depositreport")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Deposit Report
              </li>}
              {can('withdraw_report') && <li
                className={`sub-icons ${
                  selectedItem === "withdrawal" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("withdrawal", "/allreport/withdrawal")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Withdrawal Report
              </li>}
              {/* <li
                className={`sub-icons ${selectedItem === 'withdrawalreport' ? 'selected' : ''}`}
                onClick={() => handleItemClick('withdrawalreport', '/allreport/withdrawalreport')}
                style={{ color: 'black' }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Withdrawal Report
              </li> */}

             {/* {can('ib_withdraw_report') && <li
                className={`sub-icons ${
                  selectedItem === "ibwithdrawalreport" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "ibwithdrawalreport",
                    "/allreport/ibwithdrawalreport"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                IB Withdrawal Report
              </li>} */}
              {can('internal_transfer_report') && <li
                className={`sub-icons ${
                  selectedItem === "internaltransferreport" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "internaltransferreport",
                    "/allreport/internaltransferreport"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Internal Transfer Report
              </li>}
              {can('wallet_history_report') && <li
                className={`sub-icons ${
                  selectedItem === "wallethistoryreport" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "wallethistoryreport",
                    "/allreport/wallethistoryreport"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Wallet History Report
              </li>}
              {/* {can('position_report') && <li
                className={`sub-icons ${
                  selectedItem === "positionreport" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("positionreport", "/allreport/positionreport")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Position Report
              </li>} */}
              {/* {can('history_report') && <li
                className={`sub-icons ${
                  selectedItem === "historyreport" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("historyreport", "/allreport/historyreport")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                History Report
              </li>} */}
              {/* {can('login_activity_report') && <li
                className={`sub-icons ${
                  selectedItem === "loginactivity" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("loginactivity", "/allreport/loginactivity")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Login Activity Report
              </li>} */}
            </ul>
          )}

          {/* Tickets*/}
          {can('tickets') &&
          <Link
          to="/tickets"
          style={{ textDecoration: "none", color: theme === "dark" ? "white":"black" }}
        >
          <li
            className={`icons ${selectedItem === "Tickets" ? "selected" : ""}`}
            onClick={() => setSelectedItem("Email")} // Update selected item state
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faNewspaper} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              
                <span>Tickets</span>
             
            </div>
          </li>
          </Link>}

          {/* settings*/}
          <li
            className={`icons ${selectedItem === "Tickets" ? "selected" : ""}`}
            onClick={handleSettingClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faGears} className="navbar-icon-color" />
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Settings</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>
          {issetting && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {/* {can('deposit_bank_details') && <li
                className={`sub-icons ${
                  selectedItem === "depositbankdetails" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick(
                    "depositbankdetails",
                    "/settings/depositbankdetails"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Deposit Bank Details
              </li>} */}
              {can('promotion_list') && <li
                className={`sub-icons ${
                  selectedItem === "promotionlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("promotionlist", "/settings/promotionlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Promotion List
              </li>}
              {can('smtp') && <li
                className={`sub-icons ${
                  selectedItem === "promotionlist" ? "selected" : ""
                }`}
                onClick={() => handleItemClick("smtp", "/settings/smtp")}
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                SMTP
              </li>}
            </ul>
          )}

          {/* Subadmin*/}
          <li
            className={`icons ${selectedItem === "Subadmin" ? "selected" : ""}`}
            onClick={handleSubadminClick} // ✅ Corrected this line
            style={{ color: "black" }}
          >
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            <FontAwesomeIcon icon={faUserTie} className="navbar-icon-color" />{" "}
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Sub Admin</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>
          {issubadmin && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              {can('create_sub_admin') && <li
                className={`sub-icons ${
                  selectedItem === "createsubadmin" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("createsubadmin", "/subadmin/createsubadmin")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Create Sub Admin
              </li>}
              {can('sub_admin_list') && <li
                className={`sub-icons ${
                  selectedItem === "subadminlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("subadminlist", "/subadmin/subadminlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Sub Admin List
              </li>}
            </ul>
          )}

          {/* manager*/}
          {/* <li
            className={`icons ${selectedItem === "Subadmin" ? "selected" : ""}`}
            onClick={handleManagerClick} // ✅ Corrected this line
            style={{ color: "black" }}
          > */}
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            {/* <FontAwesomeIcon icon={faUserTie} className="navbar-icon-color" />{" "}
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Manager</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>
          {ismanager && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <li
                className={`sub-icons ${
                  selectedItem === "addmanager" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick("addmanager", "/manager/addmanager")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Add Manager
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "managerlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("managerlist", "/manager/managerlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Manager List
              </li>
            </ul>
          )} */}

          {/* Proptrading*/}
          {/* <li
            className={`icons ${selectedItem === "Subadmin" ? "selected" : ""}`}
            onClick={handleProptradingClick} // ✅ Corrected this line
            style={{ color: "black" }}
          > */}
            {/* <FontAwesomeIcon icon={faGift} className="navbar-icon-color" /> */}
            {/* <FontAwesomeIcon icon={faUserTie} className="navbar-icon-color" />{" "}
            <div className={`menu-item ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <span>Prop Trading</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </li>
          {isproptrading && (
            <ul className={`sub-menu ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <li
                className={`sub-icons ${
                  selectedItem === "generalconfiguaration" ? "selected" : ""
                } ${theme === 'dark' ? 'dark-mode' : ''}`}
                onClick={() =>
                  handleItemClick(
                    "generalconfiguaration",
                    "/proptrading/generalconfiguaration"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                General Configuaration
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "challengeconfiguaration" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "challengeconfiguaration",
                    "/proptrading/challengeconfiguaration"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                General Configuaration
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "challengeconfiguarationlist"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "challengeconfiguarationlist",
                    "/proptrading/challengeconfiguarationlist"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Challenge Configuration List
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "couponlist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("couponlist", "/proptrading/couponlist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Coupons List
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "addonslist" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick("addonslist", "/proptrading/addonslist")
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Add-Ons List
              </li>

              <li
                className={`sub-icons ${
                  selectedItem === "challengestatistics" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "challengestatistics",
                    "/proptrading/challengestatistics"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Challenge Statistics
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "Evaluationrequest" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "Evaluationrequest",
                    "/proptrading/Evaluationrequest"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Evaluation Request
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "paymentgetaway" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "paymentgetaway",
                    "/proptrading/paymentgetaway"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Payment Getaway
              </li>
              <li
                className={`sub-icons ${
                  selectedItem === "manualpaymentgetaway" ? "selected" : ""
                }`}
                onClick={() =>
                  handleItemClick(
                    "manualpaymentgetaway",
                    "/proptrading/manualpaymentgetaway"
                  )
                }
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faMinus} className="navbar-icon-color" />
                Manual Payment Gateways
              </li>
            </ul>
          )} */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
