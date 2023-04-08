import React, { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import toast, { Toaster } from "react-hot-toast";
import $ from "jquery";
import { Rings } from "react-loader-spinner";

const ViewAnnouncement = () => {
  const [loading, setLoading] = useState(true);
  let [announcement, setAnnouncement] = useState([]);
  const [Delete, setDelete] = useState(false);
  let [input, setInput] = useState("");

  useEffect(() => {
    db.collection("announcement")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          setAnnouncement((arr) => [...arr, data]);
          setLoading(false);
        });
      })
      .catch((err) => {});
  }, []);


  const deleteAnnouncement = (name) => {
    setDelete(true);
    db.collection("announcement")
    .doc(name)
    .delete()
    .then(() => {
      toast.success("Announcement Removed");
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
    announcement = announcement.filter((cat) => {
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
                announcement
              </h4>
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center w-100">
                  <i className="bx bx-search fs-4 lh-0" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search For announcement..."
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
                    {announcement.length === 0 ? (
                      <>
                        <h2>No Announcement Found</h2>
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
                        {announcement.map((cat, i) => (
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
                                      deleteAnnouncement(cat.name);
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

export default ViewAnnouncement;
