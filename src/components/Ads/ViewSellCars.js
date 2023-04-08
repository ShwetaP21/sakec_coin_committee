/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import Header from "../Header";
import Nav from "../Nav";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import "antd/dist/antd.css";
import { Button } from "antd";
import Modal from "react-modal";
import './../Services/model.css';

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
  Feature: {
    background: "yellow",
    padding: "10px",
    marginRight: "6px",
    marginLeft: "6px",
    color: "black",
    borderRadius: "5px",
    marginBottom: "10px",
    height: "auto",
    border: "none",
    boxShadow: "0px 0px 10px 0px green",
  },
};

const ViewSellCars = () => {
  let [car, setCar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  let [input, setInput] = useState("");

  useEffect(() => {
    const get_data = async () => {
      await db
        .collection("Sell-Cars")
        .get()
        .then((querySnapshot) => {
          const posts = querySnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          if (posts.length === 0) {
            setLoading(false);
          } else {
            setCar(posts);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    get_data();
  }, []);

  const rejectCar = (id) => {
    db.collection("Sell-Cars")
      .doc(id)
      .update({
        status: "rejected",
      })
      .then((res) => {
        toast.success("Rejected Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function openModal() {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }


  const handleApprove = async (id) => {
    await db
      .collection("Sell-Cars")
      .doc(id)
      .update({
        status: "approved",
      })
      .then(() => {
        toast.success("Approved Successfully");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };

  const handleFeatured = async (id , val) => {
    await db
      .collection("Sell-Cars")
      .doc(id)
      .update({
        isFeatured: val,
      })
      .then(() => {
        toast.success("Featured Successfully");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        window.location.reload();
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  if (input.length > 0) {
    const lower_input = input.toLowerCase();
    car = car.filter((c) => {
      return c.name.toLowerCase().match(lower_input);
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
                <span className="text-muted fw-light">{process.env.REACT_APP_NAME} /</span> View
                Sell-Cars
              </h4>
              <div className="nav-item d-flex align-items-center w-100">
                  <i className="bx bx-search fs-4 lh-0" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search For Ads..."
                    aria-label="Search..."
                    onChange={handleSearch}
                  />
                </div>
                <br />
              {loading === true ? (
                <>
                  <h2>Loading Data</h2>
                </>
              ) : (
                <>
                  {car.length === 0 ? (
                    <>
                      <h2>No Data Found</h2>
                    </>
                  ) : (
                    <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                      <>
                        {car.map((tem, i) => (
                          <>
                            <div className="col" id={tem.id}>
                              <div className="card">
                                <img
                                  className="card-img-top img-responsive"
                                  src={tem.images[0]}
                                  alt={tem.images[0]}
                                />
                                <div className="card-body">
                                  <h5 className="card-title">
                                    {tem.sub_category}
                                  </h5>
                                  <h6 className="card-title">{tem.category}</h6>
                                  {tem.status == "pending" ? (
                                    <Button
                                      style={customStyles.Reject}
                                      // icon={<DeleteOutlined />}
                                      onClick={(e) => rejectCar(tem.id)}
                                    >
                                      Reject
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {tem.status == "rejected" ? (
                                    <Button
                                      style={customStyles.Rejected}
                                      disabled
                                    >
                                      Reject
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  {tem.status != "approved" ? (
                                    <Button
                                      onClick={() => handleApprove(tem.id)}
                                      style={customStyles.Accept}
                                    >
                                      Approve
                                    </Button>
                                  ) : (
                                    <>
                                    <Button
                                      style={customStyles.Accept}
                                      disabled
                                    >
                                      Approved
                                    </Button>
                                    </>
                                  )}
                                  {tem.isFeatured == true ? ( <Button
                                      style={customStyles.Feature}
                                      onClick={()=> handleFeatured(tem.id,false)}
                                    >
                                      Un Featured
                                    </Button>) : ( <Button
                                      style={customStyles.Feature}
                                      onClick={()=> handleFeatured(tem.id,true)}
                                    >
                                      Featured
                                    </Button>)}
                                  <Button
                                      style={customStyles.Accept}
                                      onClick={() => openModal()}
                                    >
                                      View Details
                                    </Button>
                              
                                </div>
                              </div>
                            </div>
                            <Modal
                              isOpen={isOpen}
                              onRequestClose={closeModal}
                              style={customStyles}
                            >
                              <div className="modal2">
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
                                <div className="card">
                              
                                  <div className="card-body">
                                  <div className="card-title">
                                   <h4>

                                   Title : {tem.name}
                                   </h4> 
                                  </div>
                                  <h5>Seller Name : {tem.sellername}</h5>
                                  <h5>Seller Phone : {tem.sellerphone}</h5>
                                  <h5>Owners : {tem.owners}</h5>
                                  <h5>Price : {tem.price}</h5>
                                  <h5>ManuFacturing Year : {tem.manuyear}</h5>
                                  <h5>Description </h5>
                                  <p>{tem.desc} </p>
                                  </div>
                                </div>
                              </div>
                            </Modal>
                          </>
                        ))}
                      </>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ViewSellCars;
