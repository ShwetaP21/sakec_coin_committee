import React,{useState,useEffect} from "react";
import "./App.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import {db} from './firebase_config'
import DashboardCard from "./components/DashboardCard";
import DashboardTransactions from "./components/DashBoardTransactions";



function App() { 
  const [event, setEvent] = useState(0);
  const [sponsor, setSponsor] = useState(0);
  const [requests, setRequests] = useState(0);
  // const [users, setUsers] = useState(0);
  // const [ann, setAnn] = useState(0);

  useEffect(() => {
    db.collection("events")
      .get()
      .then((query) => {
        const data = query.size;
        setEvent(data);
      });

    db.collection("sponsers")
      .get()
      .then((query) => {
        const data = query.size;
        setSponsor(data);
      });

    db.collection("requests")
      .get()
      .then((query) => {
        const data = query.size;
        setRequests(data);
      });
      
    
  }, []);  
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
                <DashboardCard count={sponsor} route="/view-sponsers" name="Sponsors" img="../icons/unicons/wallet-info.png" />
                <DashboardCard count={requests} route="/view-requests" name="Requests" img="../icons/unicons/cc-warning.png" />
                </div> 
              </div>
            </div>
          </div>
          <DashboardTransactions/>
        </div>
      </div>
    </div>
  </>
  );
}

export default App;
