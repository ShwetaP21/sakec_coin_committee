/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useService } from '../../Context';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase_config';
import { toast } from 'react-hot-toast';
import _ from 'lodash';

const GenerateInvoice = () => {
    const { id } = useParams();
    const { services, setServices } = useService();
    let service = {};

    useEffect(() => {
        db.collection('Services')
            .doc(id)
            .get()
            .then((snapshot) => {
                console.log(snapshot.data())
                service = snapshot.data();
                console.log(service);
            }).catch((e) => console.log(e));
    }, []);

    const addMore = () => {
        setServices((data) => [...data, services]);
        console.log(_.flattenDepth(services, 1));
    }

    const handleChange = (e, id) => {
        const { name, value } = e.target;
        const updatedservice = services.map((service) => (
            service.id === id ? Object.assign(service, { id: uuidv4(), [name]: value }) : service
        ));
        setServices(updatedservice);
    }

    const deleteService = (id) => {
        setServices(services.filter((elem) => elem.id !== id))
    }

    const uploadData = async () => {
        await db
            .collection("Services")
            .doc(id)
            .update({
                services: _.flattenDepth(services, 1),
            })
            .then(() => {
                console.log("updated");
                toast.success("Services Added Successfully");
                setTimeout(() => {
                    window.location.href = "/View-Services";
                }, 1000)


            })
            .catch((err) => {
                console.log(err);
                window.location.reload();
            });
    }


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div>
                {
                    services.map((ser, index) => (
                        <form key={index}>
                            <div className="row mb-3">
                                <label
                                    className="col-sm-2 col-form-label"
                                    htmlFor="basic-default-name"
                                >
                                    Service Name
                                </label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="basic-default-name"
                                        placeholder="John Doe"
                                        name="name"
                                        value={ser.name}
                                        onChange={(e) => handleChange(e, ser.id)}

                                    />
                                </div>
                            </div><div className="row mb-3">
                                <label
                                    className="col-sm-2 col-form-label"
                                    htmlFor="basic-default-name"
                                >
                                    Service Price
                                </label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="basic-default-name"
                                        placeholder="John Doe"
                                        name="price"
                                        value={ser.price}
                                        onChange={(e) => handleChange(e, ser.id)}

                                    />
                                </div>
                            </div>



                            <div className="row justify-content-end">
                                <div className="col-sm-12">
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => deleteService(ser.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </form>
                    ))}
                <br />
                <div className="col-sm-12">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => addMore()}
                    >
                        Add more
                    </button>
                </div>

                <br />
                <div className="col-sm-12">
                    <button
                        type="submit"
                        className="btn btn-success"
                        onClick={() => uploadData()}
                    >
                        Generate Invoice
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GenerateInvoice