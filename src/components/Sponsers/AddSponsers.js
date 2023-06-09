import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import { db } from "../../firebase_config";
import axios from "axios";
import { UserAuth } from "../AuthContext";

const AddSponsers = () => {
  const [sponsersImage, setSponsersImage] = useState(
    "https://brent-mccardle.org/img/placeholder-image.png"
  );

  let [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  const { user } = UserAuth();

  const [sponsers, setSponsers] = useState({
    name: "",
    img: "",
    amount: 0,
    converted: false,
    date: new Date().toLocaleDateString(),
    email: user.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsers((event) => {
      return {
        ...event,
        [name]: value,
      };
    });
  };

  const handlesponsersImage = async (e) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "invoice");

    const config = {
      onUploadProgress: (e) => {
        const { loaded, total } = e;
        let percent = Math.floor((loaded * 100) / total);
        setProgress(percent);
      },
    };

    axios
      .post(
        "https://api.cloudinary.com/v1_1/dpfxrlyrv/image/upload",
        data,
        config
      )
      .then((r) => {
        setLoading(false);
        setSponsersImage(r.data.secure_url);
        toast.success("Image Uploaded Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sponsers.img = sponsersImage;
    db.collection("sponsers")
      .doc(sponsers.name)
      .set({
        name: sponsers.name,
        img: sponsers.img,
        amount: parseInt(sponsers.amount),
        converted: false,
        date: new Date().toLocaleDateString(),
        email: user.email,
      })
      .then((res) => {
        toast.success("sponsers Added Successfully");
        window.location.href = "/View-sponsers";
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
                  sponsors
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
                              Sponsers Name
                            </label>
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
                          </div>

                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Sponsers Amount
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="number"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. 1500"
                                name="amount"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-company"
                            >
                              sponsers Image / Icon
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile02"
                                accept=".jpg, .jpeg, .png"
                                onChange={handlesponsersImage}
                              />
                              <br />
                              {loading === true ? (
                                <>
                                  <h4>Uploading Image {progress} %</h4>
                                </>
                              ) : (
                                <></>
                              )}
                              <img
                                src={sponsersImage}
                                className="image"
                                alt="uploading_image"
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

export default AddSponsers;
