/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import Nav from '../Nav'
import { db } from '../../firebase_config'
import { useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { toast } from 'react-hot-toast'

const ViewEventCoins = () => {
    let [data, setData] = useState([]);
    let [input, setInput] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [registration, setRegistrations] = useState([]);
    const { name } = useParams();
    const batch = firebase.firestore().batch();


    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        await db.collection('events').doc(name).get()
            .then((doc) => {
                setData(doc.data());
                setTransactions(doc.data().transactions);
                setRegistrations(doc.data().registrations);
            })
    }

    const getSingleCommitteCoin = async (email) => {
        let coins = 0;
        await db.collection('committees').doc(email).get()
            .then((doc) => {
                coins = doc.data().coins
            })
        return coins;
    }

    const getSingleEventCoins = async (name) => {
        let coins = 0;
        await db.collection('events').doc(name).get()
            .then((doc) => {
                coins = doc.data().coins
            })
        return coins;
    }

    const giveCreditsToUser = async (e, email, data) => {
        e.preventDefault();
        const { registration_fee, committee_email, name } = data;
        let committeeCoin = await getSingleCommitteCoin(committee_email);
        let committeeSum = committeeCoin - parseInt(registration_fee);

        let eventCoin = await getSingleEventCoins(name)
        let eventSum = eventCoin - parseInt(registration_fee);

        const result = Math.random().toString(36).substring(2, 17);
        try {
            batch.set(
                db.collection("transactions").doc(result.toString()),
                {
                    id: result.toString(),
                    reason: email + "\tRegistration Reward",
                    coins: parseInt(registration_fee),
                    deposit: false,
                    date: new Date().toLocaleDateString()
                }
            );

            batch.update(
                db.collection("committees").doc(committee_email),
                {
                    coins: committeeSum,
                    transactions: firebase.firestore.FieldValue.arrayUnion({
                        id: result.toString(),
                        reason: "Reward to\t" + email + "\tfor\t" + name,
                        coins: parseInt(registration_fee),
                        deposit: false,
                        date: new Date().toLocaleDateString()
                    }),
                }
            );
            batch.update(
                db.collection("events").doc(name),
                {
                    coins: eventSum,
                    transactions: firebase.firestore.FieldValue.arrayUnion({
                        id: result.toString(),
                        reason: "Reward to\t" + email + "\tfor\t" + name,
                        coins: parseInt(registration_fee),
                        deposit: false,
                        date: new Date().toLocaleDateString()
                    }),
                });

            batch.update(
                db.collection("users").doc(email),
                {
                    coins: firebase.firestore.FieldValue.increment(parseInt(registration_fee)),
                    transactions: firebase.firestore.FieldValue.arrayUnion({
                        id: result.toString(),
                        reason: "Reward from\t" + committee_email + "\tfor" + name,
                        coins: parseInt(registration_fee),
                        deposit: true,
                        date: new Date().toLocaleDateString()
                    }),
                });
            batch.commit()
                .then(() => {
                    toast.success("Approved Succesfully");
                });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
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
                                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> Credits Management
                            </h4>
                            <div className="col-lg-4 col-md-12 col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img
                                                    src="../../icons/unicons/cc-warning.png"
                                                    alt="chart success"
                                                    className="rounded"
                                                />
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">
                                            Total Credits
                                        </span>
                                        <h3 className="card-title mb-2">{data.coins}</h3>
                                    </div>
                                </div>
                            </div>
                            <h4 className="fw-bold py-3 mb-4">
                                All Registrations
                            </h4>
                            <div className="nav-item d-flex align-items-center w-100">
                                <i className="bx bx-search fs-4 lh-0" />
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Search For users..."
                                    aria-label="Search..."
                                    onChange={handleSearch}
                                />
                            </div>
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Email</th>
                                        <th scope='col'>Give Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registration.map((d) => (
                                        <tr key={d}>
                                            <td>{d}</td>
                                            <td>
                                                <button type="button" class="btn btn-primary" onClick={(e) => giveCreditsToUser(e, d, data)}>
                                                    Give
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>

                            <h4 className="fw-bold py-3 mb-4">
                                All Transactions
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
                                        <th scope='col'>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((d) => (
                                        <tr key={d.id}>
                                            <td>{d.coins}</td>
                                            <td>{d.reason}</td>
                                            <td>{d.date}</td>
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

export default ViewEventCoins