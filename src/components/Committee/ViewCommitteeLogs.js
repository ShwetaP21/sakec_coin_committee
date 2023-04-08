/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { useParams } from 'react-router-dom'
import ExcelExportHelper from '../../helpers/ExportExcelHelper'

const ViewCommitteLogs = () => {
    let [data, setData] = useState({});
    let [logs, setLogs] = useState([]);
    const { email } = useParams();

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        await db.collection('committees')
            .doc(email)
            .get()
            .then((d) => {
                setData(d.data());
                setLogs(d.data().logs);
            })
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
                                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> View Committee Logs
                            </h4>
                            <div className="flex">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-3">

                                        <ExcelExportHelper
                                            data={logs}
                                            name={data.name}
                                        />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope='col'>Date</th>
                                        <th scope="col">Action</th>
                                        <th scope="col">IP Address</th>
                                        <th scope="col">User Agent</th>
                                        <th scope="col">Browser</th>
                                        <th scope="col">Device</th>
                                        <th scope='col'>Browser Lang</th>
                                        <th scope='col'>Browser Version</th>
                                        <th scope='col'>Browser Cookies</th>
                                    </tr>
                                </thead>
                                {logs.map((d) => (
                                    <tbody key={d.updated_at}>
                                        <tr>
                                            <td>{d.date}</td>
                                            <td>{d.action}</td>
                                            <td>{d.ip}</td>
                                            <td>{d.user_agent}</td>
                                            <td>{d.browser}</td>
                                            <td>{d.device}</td>
                                            <td>{d.browser_language}</td>
                                            <td>{d.browser_version}</td>
                                            <td>{d.browser_cookies.toLocaleString()}</td>

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

export default ViewCommitteLogs