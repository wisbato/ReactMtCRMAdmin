import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";
import "./App.css";
import Header from "./Component/Header/Header";
import Sidebar from "./Component/Sidebar/Sidebar";
import Dashboard from "./Component/Dashboard/Dashboard";
import Usermanagement from "./Pages/Usermanagement/Usermanagement";
// import UserList from './Pages/Usermanagement/UserList';
import Adduser from "./Pages/Usermanagement/component/Adduser";
import Userlist from "./Pages/Usermanagement/component/Userlist";
import Mt5account from "./Pages/Usermanagement/component/Mt5account";
import Mt5userlist from "./Pages/Usermanagement/component/Mt5userlist";
import CRMmt5userlist from "./Pages/Usermanagement/component/CRMmt5userlist";
import Followuplist from "./Pages/Usermanagement/component/Followuplist";
import Pendingdocumentlist from "./Pages/Usermanagement/component/Pendingdocumentlist";
import Approveddocument from "./Pages/Usermanagement/component/Approveddocument";
import Uploaduserdocument from "./Pages/Usermanagement/component/Uploaduserdocument";
import Addbankdetails from "./Pages/Usermanagement/component/Addbankdetails";
import Bankdetailslist from "./Pages/Usermanagement/component/Bankdetailslist";
import Userpasswordlist from "./Pages/Usermanagement/component/Userpasswordlist";
import Changepassword from "./Pages/Usermanagement/component/Changepassword";
import Addexistingclient from "./Pages/Usermanagement/component/Addexistingclient";
import Changemt5password from "./Pages/Usermanagement/component/Changemt5password";
import Updatemt5leverage from "./Pages/Usermanagement/component/Updatemt5leverage";
import Resendmt5datamail from "./Pages/Usermanagement/component/Resendmt5datamail";
import Bonus from "./Pages/Bonus/Bonus";
import Givebonus from "./Pages/Bonus/Component/Givebonus";
import Removebonus from "./Pages/Bonus/Component/Removebonus";
import Bonuslist from "./Pages/Bonus/Component/Bonuslist";
import Ibmanagement from "./Pages/IB Management/Ibmanagement";
import Ibusers from "./Pages/IB Management/Component/Ibusers";
import Ibrequests from "./Pages/IB Management/Component/Ibrequests";
import Ibplan from "./Pages/IB Management/Component/Ibplan";
import Commissiongroup from "./Pages/IB Management/Component/Commissiongroup";
import Setibcommission from "./Pages/IB Management/Component/Setibcommission";
import Moveclienttoib from "./Pages/IB Management/Component/Moveclienttoib";
import Removeclientfromib from "./Pages/IB Management/Component/Removeclientfromib";
import Symbolandtype from "./Pages/IB Management/Component/Symbolandtype";
import Flexiblecommission from "./Pages/IB Management/Component/Flexiblecommission";
import Syncdeal from "./Pages/IB Management/Component/Syncdeal";
import Groupmanagement from "./Pages/Groupmanagement/Groupmanagement";
import Addgroup from "./Pages/Groupmanagement/Component/Addgroup";
import Grouplist from "./Pages/Groupmanagement/Component/Grouplist";
import Updatemt5group from "./Pages/Groupmanagement/Component/Updatemt5group";
import Transaction from "./Pages/Transaction/Transaction";
import Clientdeposit from "./Pages/Transaction/component/Clientdeposit";
import Clientwithdrawal from "./Pages/Transaction/component/Clientwithdrawal";
import Wallettransaction from "./Pages/Transaction/component/Wallettransaction";
import IBwithdraw from "./Pages/Transaction/component/IBwithdraw";
import Internaltransfer from "./Pages/Transaction/component/Internaltransfer";
import Pendingdeposit from "./Pages/Transaction/component/Pendingdeposit";
import Pendingwithdraw from "./Pages/Transaction/component/Pendingwithdraw";
import Pendingibwithdraw from "./Pages/Transaction/component/Pendingibwithdraw";
import Sales from "./Pages/Sales/Sales";
import Salesdashboard from "./Pages/Sales/component/Salesdashboard";
import Addsale from "./Pages/Sales/component/Addsale";
import { Table } from "react-bootstrap";
import Tabless from "./Pages/Sales/component/Tabless";
import Saleslist from "./Pages/Sales/component/Saleslist";
import Leadstatus from "./Pages/Sales/component/Leadstatus";
import Leadsource from "./Pages/Sales/component/Leadsource";
import Leadlist from "./Pages/Sales/component/Leadlist";
import Email from "./Pages/Email/Email";
import News from "./Pages/News/News";
import Notifications from "./Pages/Notifications/Notifications";
import Allreport from "./Pages/Allreport/Allreport";
import Depositreport from "./Pages/Allreport/Component/Depositreport";
import IBwithdrawalreport from "./Pages/Allreport/Component/IBwithdrawalreport";
import Internaltransferreport from "./Pages/Allreport/Component/Internaltransferreport";
import Withdrawal from "./Pages/Allreport/Component/Withdrawal";
import WalletHistoryreport from "./Pages/Allreport/Component/WalletHistoryreport";
import Positionreport from "./Pages/Allreport/Component/Positionreport";
import Historyreport from "./Pages/Allreport/Component/Historyreport";
import Loginactivityreport from "./Pages/Allreport/Component/Loginactivityreport";
import Tickets from "./Pages/Tickets/Tickets";
import Settings from "./Pages/Settings/Settings";
import Depositbankdetails from "./Pages/Settings/Component/Depositbankdetails";
import Promotionlist from "./Pages/Settings/Component/Promotionlist";
import Subadmin from "./Pages/Subadmin/Subadmin";
import Createsubadmin from "./Pages/Subadmin/Component/Createsubadmin";
import Subadminlist from "./Pages/Subadmin/Component/Subadminlist";
import Manager from "./Pages/Manager/Manager";
import Addmanager from "./Pages/Manager/component/Addmanager";
import Managerlist from "./Pages/Manager/component/Managerlist";
import Proptrading from "./Pages/Proptrading/Proptrading";
import Generalconfiguration from "./Pages/Proptrading/Component/Generalconfiguration";
import Challengeconfiguaration from "./Pages/Proptrading/Component/Challengeconfiguaration";
import Challengeconfiguarationlist from "./Pages/Proptrading/Component/Challengeconfiguarationlist";
import Couponlist from "./Pages/Proptrading/Component/Couponlist";
import Addonslist from "./Pages/Proptrading/Component/Addonslist";
import Challengestatistics from "./Pages/Proptrading/Component/Challengestatistics";
import Evaluationrequest from "./Pages/Proptrading/Component/Evaluationrequest";
import Paymentgetaway from "./Pages/Proptrading/Component/Paymentgetaway";
import Manualpaymentgetaway from "./Pages/Proptrading/Component/Manualpaymentgetaway";
import Retailscaling from "./Pages/IB Management/Component/Retailscaling";
import Addplan from "./Pages/IB Management/Component/Addplan";
import Addcommissiongrp from "./Pages/IB Management/Component/Addcommissiongrp";
import Commissiongrpretail from "./Pages/IB Management/Component/Commissiongrpretail";
import Viewuserlist from "./Component/Dashboard/component/Viewuserlist";
import Clientlist from "./Component/Dashboard/component/Clientlist";
import Addnews from "./Pages/News/Component/Addnews";
import Viewticket from "./Pages/Tickets/Component/Viewticket";
import Addpermission from "./Pages/Subadmin/Component/Addpermission";
import Systemtimeedit from "./Pages/Proptrading/Component/Systemtimeedit";
import Addcoupon from "./Pages/Manager/component/Addcoupon";
import Addnewgateway from "./Pages/Proptrading/Component/Addnewgateway";
import Pendingdocumentlistview from "./Pages/Usermanagement/component/Pendingdocumentlistview";
import Approvedrequestlist from "./Pages/Usermanagement/component/Approvedrequestlist";
import Grouplistedit from "./Pages/Groupmanagement/Component/Grouplistedit";
import Addlead from "./Pages/Sales/component/Addlead";
import Addons from "./Pages/Proptrading/Component/Addons";
import Editnews from "./Pages/News/Component/Editnews";
import Login from "./Component/Login/Login";
import MainLayout from "./layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import toast, { Toaster } from "react-hot-toast";
import { socket, disconnectSocket } from "./utils/socket";
import ChangeTheme from "./Component/theme/ChangeTheme";
import SmtpPage from "./Pages/Settings/Component/SmtpPage";


function App() {



  useEffect(() => {
    
 
    
    socket.on("connect", () => {
      console.log("🟢 WS connected:", socket.id);
    });
 
    socket.on("connect_error", (err) => {
      console.error("🔴 WS connect error:", err.message);
    });
 
    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WS disconnected:", reason);
    });
 
    // Cleanup function: disconnect when component unmounts
    return () => {
      disconnectSocket();
    };
  }, []); 

  useEffect(() => {
    // Ensure theme is initialized
    const savedTheme = localStorage.getItem("theme") || "green";
    const savedMode = localStorage.getItem("theme-mode") || "dark";

    document.documentElement.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route - Login */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              {/* All your other routes here */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/viewuserlist" element={<Viewuserlist />} />

              <Route path="/usermanagement/*" element={<Usermanagement />}>
                {/* <Route path="user-list" element={<UserList />} /> */}
                <Route path="add-user" element={<Adduser />} />
                <Route path="userlist" element={<Userlist />} />
                <Route path="mt5account" element={<Mt5account />} />
                <Route path="mt5userlist" element={<Mt5userlist />} />
                <Route path="crmmt5userlist" element={<CRMmt5userlist />} />
                <Route path="followuplist" element={<Followuplist />} />
                <Route
                  path="pendingdocumentlist/*"
                  element={<Pendingdocumentlist />}
                />
                <Route
                  path="pendingdocumentlist/pendingdocumentlistview/:userId"
                  element={<Pendingdocumentlistview />}
                />

                <Route path="approveddocument" element={<Approveddocument />} />
                <Route
                  path="aploaduserdocument"
                  element={<Uploaduserdocument />}
                />
                <Route path="addbankdetails" element={<Addbankdetails />} />
                <Route path="bankdetailslist" element={<Bankdetailslist />} />
                <Route path="userpasswordlist" element={<Userpasswordlist />} />
                <Route path="changepassword" element={<Changepassword />} />
                <Route
                  path="addexistingclient"
                  element={<Addexistingclient />}
                />
                <Route
                  path="changemt5password"
                  element={<Changemt5password />}
                />
                <Route
                  path="updatemt5leverage"
                  element={<Updatemt5leverage />}
                />
                <Route
                  path="resendmt5datamail"
                  element={<Resendmt5datamail />}
                />
              </Route>
              <Route path="/bonus" element={<Bonus />}>
                {/* next page */}
                <Route path="givebonus" element={<Givebonus />} />
                <Route path="removebonus" element={<Removebonus />} />
                <Route path="bonuslist" element={<Bonuslist />} />
              </Route>
              <Route path="/ibmanagement" element={<Ibmanagement />}>
                {/* next page */}
                <Route path="givebonus" element={<Givebonus />} />
                <Route path="ibusers" element={<Ibusers />} />
                <Route path="ibrequests" element={<Ibrequests />} />
                <Route path="ibplan" element={<Ibplan />} />
                <Route path="commissiongroup" element={<Commissiongroup />} />
                <Route path="setibcommission" element={<Setibcommission />} />
                <Route path="moveclienttoib" element={<Moveclienttoib />} />
                <Route
                  path="removeclientfromib"
                  element={<Removeclientfromib />}
                />
                <Route path="symbolandtype" element={<Symbolandtype />} />
                <Route
                  path="flexiblecommission"
                  element={<Flexiblecommission />}
                />
                <Route path="syncdeal" element={<Syncdeal />} />
              </Route>
              <Route path="/groupmanagement" element={<Groupmanagement />}>
                {/* next page */}
                <Route path="addgroup" element={<Addgroup />} />
                <Route path="grouplist" element={<Grouplist />} />
                <Route path="updatemt5group" element={<Updatemt5group />} />
              </Route>

              <Route path="/transaction" element={<Transaction />}>
                {/* next page */}
                <Route path="clientdeposit" element={<Clientdeposit />} />
                <Route path="clientwithdrawal" element={<Clientwithdrawal />} />
                <Route
                  path="wallettransaction"
                  element={<Wallettransaction />}
                />
                <Route path="ibwithdraw" element={<IBwithdraw />} />
                <Route path="internaltransfer" element={<Internaltransfer />} />
                <Route path="pendingdeposit" element={<Pendingdeposit />} />
                <Route path="pendingwithdraw" element={<Pendingwithdraw />} />
                <Route
                  path="pendingibwithdraw"
                  element={<Pendingibwithdraw />}
                />
              </Route>

              <Route path="/sales" element={<Sales />}>
                {/* next page */}
                <Route path="salesdashboard" element={<Salesdashboard />} />
                {/* <Route path="addsale" element={<Addsale/>} /> */}
                <Route path="addsale" element={<Addsale />} />
                <Route path="saleslist" element={<Saleslist />} />
                <Route path="leadstatus" element={<Leadstatus />} />
                <Route path="leadsource" element={<Leadsource />} />
                <Route path="leadlist" element={<Leadlist />} />
              </Route>
              <Route path="/email" element={<Email />}>
                {/* next page */}
              </Route>

              <Route path="/news" element={<News />}>
                {/* next page */}
              </Route>

              <Route path="/notifications" element={<Notifications />}>
                {/* next page */}
              </Route>
              <Route path="/allreport" element={<Allreport />}>
                {/* next page */}

                <Route path="depositreport" element={<Depositreport />} />
                <Route path="withdrawal" element={<Withdrawal />} />

                <Route
                  path="ibwithdrawalreport"
                  element={<IBwithdrawalreport />}
                />
                <Route
                  path="internaltransferreport"
                  element={<Internaltransferreport />}
                />
                <Route
                  path="wallethistoryreport"
                  element={<WalletHistoryreport />}
                />
                <Route path="positionreport" element={<Positionreport />} />
                <Route path="historyreport" element={<Historyreport />} />
                <Route path="loginactivity" element={<Loginactivityreport />} />
              </Route>

              <Route path="/tickets" element={<Tickets />}>
                {/* next page */}
              </Route>

              <Route path="/settings" element={<Settings />}>
                {/* next page */}
                <Route
                  path="depositbankdetails"
                  element={<Depositbankdetails />}
                />
                <Route path="promotionlist" element={<Promotionlist />} />
                <Route path="smtp" element={<SmtpPage />} />
              </Route>

              <Route path="/subadmin" element={<Subadmin />}>
                {/* next page */}
                <Route path="createsubadmin" element={<Createsubadmin />} />
                <Route path="subadminlist" element={<Subadminlist />} />
              </Route>
              <Route path="/manager" element={<Manager />}>
                {/* next page */}
                <Route path="addmanager" element={<Addmanager />} />
                <Route path="managerlist" element={<Managerlist />} />
              </Route>

              <Route path="/proptrading" element={<Proptrading />}>
                {/* next page */}
                <Route
                  path="generalconfiguaration"
                  element={<Generalconfiguration />}
                />
                <Route
                  path="challengeconfiguaration"
                  element={<Challengeconfiguaration />}
                />
                <Route
                  path="challengeconfiguarationlist"
                  element={<Challengeconfiguarationlist />}
                />
                <Route path="couponlist" element={<Couponlist />} />
                <Route path="addonslist" element={<Addonslist />} />
                <Route
                  path="challengestatistics"
                  element={<Challengestatistics />}
                />
                <Route
                  path="Evaluationrequest"
                  element={<Evaluationrequest />}
                />
                <Route path="paymentgetaway" element={<Paymentgetaway />} />
                <Route
                  path="manualpaymentgetaway"
                  element={<Manualpaymentgetaway />}
                />
              </Route>

              <Route path="/retail" element={<Retailscaling />} />
              <Route path="/addplan" element={<Addplan />} />
              <Route
                path="/addcommissiongroup"
                element={<Addcommissiongrp />}
              />
              <Route
                path="/commissiongrpretail"
                element={<Commissiongrpretail />}
              />
              <Route path="/addnews" element={<Addnews />} />
              <Route path="/viewticket/:id" element={<Viewticket />} />
              <Route path="/addpermission" element={<Addpermission />} />
              <Route path="/addmanager" element={<Addmanager />} />
              <Route path="/systemtimeedit" element={<Systemtimeedit />} />
              <Route
                path="generalconfiguaration"
                element={<Generalconfiguration />}
              />
              <Route
                path="challengeconfiguaration"
                element={<Challengeconfiguaration />}
              />
              <Route path="addcoupon" element={<Addcoupon />} />
              <Route path="addnewgateway" element={<Addnewgateway />} />
              <Route
                path="approvedrequestlist/:userId"
                element={<Approvedrequestlist />}
              />
              <Route path="grouplistedit/:id" element={<Grouplistedit />} />
              <Route path="addlead" element={<Addlead />} />
              <Route path="addons" element={<Addons />} />
              <Route path="editnews/:id" element={<Editnews />} />
              <Route  path="changetheme" element={<ChangeTheme />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
