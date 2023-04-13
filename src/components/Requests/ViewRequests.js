import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { Link } from 'react-router-dom'

const ViewRequests = () => {
    let [data, setData] = useState([]);
    let [input, setInput] = useState("");

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        await db.collection('requests').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((element) => {
                    let tdata = element.data();
                    setData((arr) => [...arr, tdata]);
                })
            })
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    if (input.length > 0) {
        const lower_input = input.toLowerCase();
        data = data.filter((d) => {
            return d.reason.toLowerCase().match(lower_input);
        });
    }

    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Header />
                    <div className="layout-page">
                        <Nav />
                        <div className="container-xxl flex-grow-1 container-p-y">

                            <h4 className="fw-bold py-3 mb-4">
                                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> View Requests
                            </h4>
                            <div className="nav-item d-flex align-items-center w-100">
                                <i className="bx bx-search fs-4 lh-0" />
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Search For transactions..."
                                    aria-label="Search..."
                                    onChange={handleSearch}
                                />
                            </div>
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Reason</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Date</th>
                                        <th scope='col'>Event</th>
                                        <th scope='col'>Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((d) => (
                                        <tr key={d.id}>
                                            <td>{d.amount}</td>
                                            <td>{d.reason}</td>
                                            <td>{d.status}</td>
                                            <td>{d.date}</td>
                                            <td>{d.event}</td>
                                            {d.status === 'Approve' ? (
                                                <td>
                                                    <button type="button" class="btn btn-primary">
                                                        <Link to={`/invoice/${d.event}`} className='text-white' >View</Link>
                                                    </button>
                                                </td>
                                            ) :
                                                (
                                                    <td>
                                                        Waiting
                                                    </td>
                                                )}

                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewRequests