/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { useParams } from 'react-router-dom'


const MyCars = () => {
  const [data, setData] = useState([]);
  const { email } = useParams();

  useEffect(() => {
    db.collection('Users')
      .doc(email)
      .get()
      .then((snapshot) => {
        const logs = [];
        const data = {
          id: snapshot.data().id,
          mycars: snapshot.data().mycars,
        };
        logs.push(data);

        setData(logs);
        console.log(data);
      });
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Header />
        <div className="layout-page">
          <Nav />
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">{process.env.REACT_APP_NAME} / View User/</span>  User Cars
            </h4>


            <div className='card-group'>
              {data.map((s, i) => (
                <p key={i}>{s.mycars.map((c, i) => (
                  <div className="card-body" key={i}>
                    <hr />
                    <h3>Vehicle No : {c.vehicleno}</h3>
                    <h4>Brand : {c.brandname}</h4>
                    <h5 className="card-title">
                      Fuel Type :{c.fueltype}
                    </h5>
                    <h5 className="card-title">
                      Manufacture Year : {c.manufacturingyear}
                    </h5>
                  </div>
                ))}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCars