import React,{useState,useEffect} from "react";
import "./App.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import {db} from './firebase_config'
import DashboardCard from "./components/DashboardCard";



function App() { 
  const [event, setEvent] = useState(0);
  const [sponsor, setSponsor] = useState(0);
  const [coins, setCoins] = useState(0);
  // const [users, setUsers] = useState(0);
  // const [ann, setAnn] = useState(0);

  useEffect(() => {
    db.collection("Services")
      .get()
      .then((query) => {
        const data = query.size;
        setEvent(data);
      });

    db.collection("Sell-Cars")
      .get()
      .then((query) => {
        const data = query.size;
        setSponsor(data);
      });

    db.collection("technician")
      .get()
      .then((query) => {
        const data = query.size;
        setCoins(data);
      });
      
    
  }, []);  // db.collection("Users")
      // .get()
      // .then((query) => {
      //   const data = query.size;
      //   setUsers(data);
      // });
      
      // db.collection("announcement")
      // .get()
      // .then((query) => {
      //   const data = query.size;
      //   setAnn(data);
      // });
    return (
    <>
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <Nav />
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
              <div className="col-lg-12 col-md-4 order-1">
                <div className="row">
                <DashboardCard count={event} route="/view-events" name="Events" img="../icons/unicons/chart-success.png" />
                <DashboardCard count={sponsor} route="/view-sponsors" name="Sponsors" img="../icons/unicons/wallet-info.png" />
                <DashboardCard count={coins} route="/view-coins" name="Coins" img="../icons/unicons/cc-warning.png" />
                {/* <DashboardCard count={users} route="/View-User" name="Users" img="../icons/unicons/wallet.png" />
                <DashboardCard count={ann} route="/View-Announcement" name="Announcements" img="../icons/unicons/chart.png" />*/}
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default App;
