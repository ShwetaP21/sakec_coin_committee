import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import { db } from "../../firebase_config";

const AddTechnician = () => {
  const [technician, setTechnician] = useState({
    id:"",
    name: "",
    phone:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechnician((event) => {
      return {
        ...event,
        [name]: value,
      };
    });
  };

  
  const onSubmit = (e) => {
    e.preventDefault();
    const result = Math.random().toString(36).substring(2, 17);
    technician.id   = result;
    db.collection("technician")
      .doc(technician.id)
      .set(technician)
      .then((res) => {
        toast.success("Technician Added Successfully");
        // window.location.href = "/Categories";
      })
      .catch((err) => {
        console.log(err);
      });
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
                  Technician
                </h4>
                {/* Basic Layout & Basic with Icons */}
                <div className="row">
                  {/* Basic Layout */}
                  <div className="col-xxl">
                    <div className="card mb-4">
                      <div className="card-body">
                        <form>
                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Techinician Name
                            </label>
                            <br /> <br />
                            <br /> <br />
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="John Doe"
                                name="name"
                                onChange={handleChange}
                              />
                            </div>

                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Techinician Phone
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="John Doe"
                                name="phone"
                                onChange={handleChange}
                              />
                            </div>
                          </div>                        
                

                          <div className="row justify-content-end">
                            <div className="col-sm-12">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={onSubmit}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-backdrop fade" />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AddTechnician;
