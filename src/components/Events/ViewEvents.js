/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { UserAuth } from '../AuthContext'

const ViewEvents = () => {
    let [data, setData] = useState([]);
    let [input, setInput] = useState("");
    let [ipAddress, setIpAddress] = useState("");
    const { user } = UserAuth();

    useEffect(() => {
        const getIpAddress = async () => {
            const response = await fetch('https://api.ipify.org/?format=json');
            const data = await response.json();
            setIpAddress(data.ip);
        };
        getIpAddress();
        loadData();
    }, [])

    const loadData = async () => {
        try {
            await db
                .collection('events')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((element) => {
                        let cData = element.data();
                        setData((arr) => [...arr, cData]);
                    })
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        await db.collection('committeess').doc(user.email).collection('events').doc(id.toString()).update({
            soft_delete: true,
            logs: firebase
                .firestore
                .FieldValue
                .arrayUnion({
                    ip: ipAddress,
                    date: new Date().toLocaleString(),
                    action: "Disabled Committee",
                    user_agent: window.navigator.userAgent,
                    device: window.navigator.platform,
                    browser: window.navigator.appCodeName,
                    browser_version: window.navigator.appVersion,
                    browser_online: window.navigator.onLine,
                    browser_language: window.navigator.language,
                    browser_cookies: window.navigator.cookieEnabled,
                }),
        })
            .then(() => {
                toast.success('Event Deleted Successfully');
                window.location.reload();
            }).catch((error) => {
                toast.error('Error Deleting Event')
                console.error('Error removing document: ', error);
            });
    }

    if (input.length > 0) {
        const lower_input = input.toLowerCase();
        data = data.filter((d) => {
            return d.name.toLowerCase().match(lower_input);
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
                                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> View Events
                            </h4>
                            <div className="nav-item d-flex align-items-center w-100">
                                <i className="bx bx-search fs-4 lh-0" />
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Search For Events..."
                                    aria-label="Search..."
                                    onChange={handleSearch}
                                />
                            </div>
                            <br />
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope='col'>Banner</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Co-ordinator Name</th>
                                        <th scope="col">Co-ordinator Contact</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                        <th scope='col'>Coins</th>
                                    </tr>
                                </thead>
                                {data.map((d) => (
                                    <tbody key={d.updated_at}>
                                        <tr>
                                            <td>
                                                <img
                                                    src={d.photo_url}
                                                    alt="logo"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            </td>
                                            <td>{d.name}</td>
                                            <td>{d.date}</td>
                                            {/* <td><button type="button" className="btn btn-primary"> Events</button></td> */}
                                            <td>{d.coordinator_name}</td>
                                            <td>{d.coordinator_phone.toString()}</td>
                                            <td><Link to={`/edit-event`}><button type="button" className="btn btn-secondary"> Edit</button></Link></td>
                                            {/* <td><button type="button" className="btn btn-outline-info"> Transactions </button></td> */}
                                            <td><button type="button" className="btn btn-danger" onClick={(e) => handleDelete(e, d.id)}> Delete</button></td>
                                            <td><Link to={`/view-logs`}><button type="button" className="btn btn-outline-warning"> Coins</button></Link></td>
                                        </tr>
                                    </tbody>
                                ))
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewEvents