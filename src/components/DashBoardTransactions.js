import React, { useState } from 'react'
import { useEffect } from 'react'
import { db } from '../firebase_config'
import { Link } from 'react-router-dom'
import TransactionsExcelExportHelper from '../helpers/TransactionsExcelExportHelper'

const DashboardTransactions = () => {
    let [data, setData] = useState([]);
    let [input, setInput] = useState("");

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        await db.collection('committees').doc('ieee@sakec.ac.in').get()
            .then((doc) => {
                if (doc.exists) {
                    setData(doc.data().transactions);
                }
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

        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="flex">
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-3">
                        <TransactionsExcelExportHelper
                            data={data}
                        />
                    </div>
                </div>
            </div>

            <h4 className="fw-bold py-3 mb-4">
                Recent Transactions
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
                        <th scope='col'>Type</th>
                        <th scope='col'>Date</th>
                        <th scope='col'>Delete</th>
                        <th scope='col'>Invoice</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id}>
                            <td>{d.coins}</td>
                            <td>{d.reason}</td>
                            <td>{d.deposit === true ? 'Deposit' : 'Withdraw'}</td>
                            <td>{d.date}</td>
                            <td><button type="button" class="btn btn-danger"> Delete</button></td>
                            <td>
                                <button type="button" class="btn btn-primary">
                                    <Link to={`/invoice/${d.id}`} className='text-white' >View</Link>
                                </button>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DashboardTransactions