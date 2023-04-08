import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import firebase from 'firebase/compat/app'

const ViewCommitte = () => {
    let [data, setData] = useState([]);
    let [input, setInput] = useState("");
    let [ipAddress, setIpAddress] = useState("");

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
        await db.collection('committees')
            .where('soft_delete', '==', false)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((element) => {
                    let cData = element.data();
                    setData((arr) => [...arr, cData]);
                })
            })
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        await db.collection('committees').doc(id).update({
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
                toast.success('Committee Deleted Successfully');
                window.location.reload();
            }).catch((error) => {
                toast.error('Error Deleting Committee')
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
                                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> View Committes
                            </h4>
                            <div className="nav-item d-flex align-items-center w-100">
                                <i className="bx bx-search fs-4 lh-0" />
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Search For committees..."
                                    aria-label="Search..."
                                    onChange={handleSearch}
                                />
                            </div>
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope='col'>Logo</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Events</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Transactions</th>
                                        <th scope="col">Delete</th>
                                        <th scope='col'>Logs</th>
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
                                            <td>{d.email}</td>
                                            <td><button type="button" class="btn btn-primary"> Events</button></td>
                                            <td><Link to={`/edit-committee/${d.email}`}><button type="button" class="btn btn-secondary"> Edit</button></Link></td>
                                            <td><button type="button" class="btn btn-outline-info"> Transactions </button></td>
                                            <td><button type="button" class="btn btn-danger" onClick={(e) => handleDelete(e, d.email)}> Delete</button></td>
                                            <td><Link to={`/view-logs/${d.email}`}><button type="button" class="btn btn-outline-warning"> Logs</button></Link></td>
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

export default ViewCommitte