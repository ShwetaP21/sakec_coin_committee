import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../../firebase_config";
import Header from "../Header";
import Nav from "../Nav";
import { UserAuth } from "../AuthContext";

const AddRequest = () => {
    /* A state hook. It is used to store the data in the state. */
    const [events, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [event, setEvents] = useState();
    const [reason, setReason] = useState();
    const [amount, setAmount] = useState(0);
    const { user } = UserAuth();

    /* A hook that is used to fetch data from the database. */
    useEffect(() => {
        db.collection("events")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((element) => {
                    var data = element.data();
                    setEvent((arr) => [...arr, data]);
                    setLoading(false);
                });
            })
            .catch((err) => { });
    }, []);


    const changeEvent = async (e) => {
        setEvents(e.target.value);
    };

    /**
     * It takes the value of the input field and adds it to the array of sub_events.
     * @param e - event
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await
                db.collection("requests")
                    .doc(event)
                    .set({
                        event: event,
                        reason: reason,
                        amount: parseInt(amount),
                        status: 'pending',
                        email: user.email,
                        date: new Date().toLocaleString()
                    })
                    .then(() => {
                        toast.success("Request Added");
                        window.location.href = "/view-requests";

                    });
        }
        catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Header />
                    <div className="layout-page">
                        <Nav />
                        <div className="content-wrapper">
                            {/* Content */}
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <h4 className="fw-bold py-3 mb-4">
                                    <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> Add
                                    Request
                                </h4>
                                {/* Basic Layout & Basic with Icons */}
                                <div className="row">
                                    {/* Basic Layout */}
                                    <div className="col-xxl">
                                        <div
                                            className="card mb-4"
                                            style={{ background: "transparent", boxShadow: "none" }}
                                        >
                                            <div className="card-body">
                                                <div className="mb-3 col-sm-12">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="basic-default-fullname"
                                                    >
                                                        Select Event
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        name="state"
                                                        required
                                                        onChange={changeEvent}
                                                    >
                                                        <option selected>---------------</option>
                                                        {loading === true ? (
                                                            <>
                                                                <option>Loading events.....</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {events.map((eve, i) => (
                                                                    <>
                                                                        <option value={eve.name}>{eve.name}</option>
                                                                    </>
                                                                ))}
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                                {/* <div className="row mb-3"> */}
                                                <div className="row mb-3">
                                                    <label
                                                        className="col-sm-2 col-form-label"
                                                        htmlFor="basic-default-name"
                                                    >
                                                        Reason
                                                    </label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="basic-default-name"
                                                            placeholder="Ex. I need coins"
                                                            name="reason"
                                                            required
                                                            onChange={(e) => setReason(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label
                                                        className="col-sm-2 col-form-label"
                                                        htmlFor="basic-default-name"
                                                    >
                                                        Amount
                                                    </label>
                                                    <div className="col-sm-10">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="basic-default-name"
                                                            placeholder="Ex. 500 credits"
                                                            name="amount"
                                                            required
                                                            onChange={(e) => setAmount(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row justify-content-start col-md-2">
                                                    <div className="col-sm-2">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            onClick={onSubmit}
                                                        >
                                                            Send Request
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default AddRequest;
