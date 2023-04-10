import React, { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import toast, { Toaster } from "react-hot-toast";
import $ from "jquery";
import { Rings } from "react-loader-spinner";

const ViewSponsers = () => {
  const [loading, setLoading] = useState(true);
  let [sponsers, setSponsers] = useState([]);
  const [Delete, setDelete] = useState(false);
  let [input, setInput] = useState("");

  useEffect(() => {
    db.collection("sponsers")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          setSponsers((arr) => [...arr, data]);
          setLoading(false);
        });
      })
      .catch((err) => {});
  }, []);


  const deletesponsers = (name) => {
    setDelete(true);
    db.collection("sponsers")
    .doc(name)
    .delete()
    .then(() => {
      toast.success("Sponsers Removed");
      $("#" + name).fadeOut();
      setDelete(false);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  if (input.length > 0) {
    const lower_input = input.toLowerCase();
    sponsers = sponsers.filter((cat) => {
      return cat.name.toLowerCase().match(lower_input);
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
                <span className="text-muted fw-light"> {process.env.REACT_APP_NAME} /</span> View
                sponsors
              </h4>
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center w-100">
                  <i className="bx bx-search fs-4 lh-0" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search For sponsers..."
                    aria-label="Search..."
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <br />
              <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                {loading === true ? (
                  <>
                    <h2>
                      {" "}
                      <Rings
                        height="80"
                        width="80"
                        color="#456CCF"
                        radius="6"
                        visible={true}
                        ariaLabel="rings-loading"
                      />
                      Loading Data....
                    </h2>
                  </>
                ) : (
                  <>
                    {sponsers.length === 0 ? (
                      <>
                        <h2>No sponsers Found</h2>
                      </>
                    ) : (
                      <>
                        {Delete === true ? (
                          <>
                            <div className="col-lg-12">
                              <h4>Deleting Data...</h4>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {sponsers.map((cat, i) => (
                          <>
                            <div className="col" id={cat.name}>
                              <div className="card">
                                <img
                                  className="card-img-top image"
                                  src={cat.img}
                                  alt={cat.img}
                                />
                                <div className="card-body">
                                  <h5 className="card-title">{cat.name}</h5>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                      deletesponsers(cat.name);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
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

export default ViewSponsers;
