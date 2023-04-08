/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import toast, { Toaster } from "react-hot-toast";
import "antd/dist/antd.css";
import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import Header from "../Header";
import "aos/dist/aos.css";
import AOS from "aos";
import Nav from "../Nav";
import "./model.css";
import "../../App.css";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from './Invoice';
import { format } from 'timeago.js';


const { Option } = Select;
AOS.init();
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    background: "none",
    bottom: "auto",
    border: "none",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  Reject: {
    background: "red",
    padding: "10px",
    marginRight: "6px",
    height: "auto",
    marginLeft: "6px",
    color: "white",
    borderRadius: "5px",
    marginBottom: "10px",
    border: "none",
    boxShadow: "0px 0px 10px 0px red",
  },
  Rejected: {
    background: "white",
    padding: "10px",
    marginRight: "6px",
    height: "auto",
    marginLeft: "6px",
    color: "red",
    fontWeight: "bold",
    borderRadius: "5px",
    marginBottom: "10px",
    border: "none",
    boxShadow: "0px 0px 10px 0px red",
  },
  Accept: {
    background: "#1990ff",
    padding: "10px",
    marginRight: "6px",
    marginLeft: "6px",
    color: "white",
    borderRadius: "5px",
    marginBottom: "10px",
    height: "auto",
    border: "none",
    boxShadow: "0px 0px 10px 0px #1990ff",
    cursor: "pointer"
  },
  Complete: {
    background: "green",
    padding: "10px",
    marginRight: "6px",
    marginLeft: "6px",
    color: "white",
    borderRadius: "5px",
    marginBottom: "10px",
    height: "auto",
    border: "none",
    boxShadow: "0px 0px 10px 0px green",
  },
};

const ViewServices = () => {
  const [loading, setLoading] = useState(true);
  let [services, setService] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [currval, setcurrentval] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let [input, setInput] = useState("");


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [technician, setTechnician] = useState();

  const handleReject = async (e, s) => {
    if (
      window.confirm("Are you sure you want to reject this service request?")
    ) {
      await db.collection("Services").doc(s.id).update({
        status: "rejected",
      });
      window.location.reload();
    }
  };
  const handleCompleted = async (e, s) => {
    if (
      window.confirm("Are you sure you want to complete this service request?")
    ) {
      await db.collection("Services").doc(s.id).update({
        status: "completed",
      });
      window.location.reload();
    }
  };
  const onTechinicianChange = (value) => {
    setTechnician(value);
    console.log(value);
  };
  const handleApprove = async (s) => {
    await db
      .collection("Services")
      .doc(s.id)
      .update({
        status: "approved",
        technicianPhone: technician,
        technicianName: "SP Autoworks"
      })
      .then(() => {
        toast.success("approved");
        closeModal();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
  useEffect(() => {
    db.collection("Services")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          setService((arr) => [...arr, data]);
          setLoading(false);
        });
      })
      .catch((err) => { });
    db.collection("technician")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          setTechnicians((arr) => [...arr, data]);
        });
      })
      .catch((err) => { });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  if (input.length > 0) {
    const lower_input = input.toLowerCase();
    services = services.filter((service) => {
      return service.name.toLowerCase().match(lower_input);
    });
  }

  const showDownloadLink = (service) => (
    <PDFDownloadLink
      document={<Invoice service={service} />}
      fileName="invoice.pdf"
      className="btn btn-raised"
    >
      Download Invoice
    </PDFDownloadLink>
  );

  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Header />
          <div className="layout-page">
            <Nav />
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4">
                <span className="text-muted fw-light">
                  {process.env.REACT_APP_NAME} /
                </span>{" "}
                View services
              </h4>
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center w-100">
                  <i className="bx bx-search fs-4 lh-0" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search For services..."
                    aria-label="Search..."
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <br />
              <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                {loading === true ? (
                  <>
                    <h2>Loading Data</h2>
                  </>
                ) : (
                  <>
                    {services.length === 0 ? (
                      <>
                        <h2>No Service Found</h2>
                      </>
                    ) : (
                      <>
                        {services.map((s, i) => (
                          <>
                            <div className="col" key={i}>
                              <div className="card" data-aos="zoom-in">
                                <div className="card-body">
                                  <h5>
                                    {s.id}
                                  </h5>
                                  <hr />
                                  <h3>Vehicle No : {s.vehicleno}</h3>
                                  <h4>Brand : {s.brandname}</h4>
                                  <h5 className="card-title">
                                    Customer Name :{s.name}
                                  </h5>
                                  <h5 className="card-title">
                                    Customer Contact : {s.phone}
                                  </h5>
                                  <h6>Added {format(s.date)}</h6>
                                </div>
                                <div className="buttons">
                                  {s.status == "pending" ? (
                                    <Button
                                      style={customStyles.Reject}
                                      // icon={<DeleteOutlined />}
                                      onClick={(e) => handleReject(e, s)}
                                    >
                                      Reject
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {s.status == "rejected" ? (
                                    <Button
                                      style={customStyles.Rejected}
                                      disabled
                                    >
                                      Reject
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {s.status != "approved" && s.status != 'completed' ? (
                                    <Button
                                      onClick={() => {
                                        openModal();
                                        setcurrentval(s);
                                      }}
                                      style={customStyles.Accept}
                                    >
                                      Accept
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {s.status != "rejected" &&
                                    s.status != "completed" &&
                                    s.status != "pending" ? (
                                    <Button
                                      onClick={(e) => handleCompleted(e, s)}
                                      style={customStyles.Complete}
                                    >
                                      Complete
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {s.status == "completed" ? (
                                    <>

                                      <Button
                                        style={customStyles.Complete}
                                      >
                                        <Link to={`/service/${s.id}`}>

                                          Add Services
                                        </Link>
                                      </Button>
                                      {!s.services ? (<></>) : showDownloadLink(s)}

                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Modal
                              isOpen={modalIsOpen}
                              onRequestClose={closeModal}
                              style={customStyles}
                              contentLabel="Register"
                            >
                              <div className="modalcard">
                                <button
                                  className="close"
                                  style={{
                                    outline: "none",
                                    border: "none",
                                    textAlign: "center",
                                  }}
                                  onClick={closeModal}
                                >
                                  X
                                </button>
                                <br />
                                <form>
                                  <Select
                                    showSearch
                                    placeholder="Select a technician"
                                    optionFilterProp="children"
                                    onChange={onTechinicianChange}
                                  >
                                    {technicians.map((item) => (
                                      <Option key={item.id} value={item.phone}>{item.name}</Option>
                                    ))}
                                  </Select>
                                  <br />
                                  <input
                                    type="button"
                                    onClick={() => handleApprove(s)}
                                    value="Approve"
                                    className="sub"
                                  />
                                  <br />
                                </form>
                              </div>
                            </Modal>
                          </>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ViewServices;
