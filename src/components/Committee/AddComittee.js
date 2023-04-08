import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import { authGenerate, db } from "../../firebase_config";
import axios from "axios";
import firebase from 'firebase/compat/app'

// const arrayToUpdate = firebase.firestore.FieldValue.arrayUnion(value)

const AddComittee = () => {
  const [committeeImage, setCommitteeImage] = useState(
    "https://brent-mccardle.org/img/placeholder-image.png"
  );

  let [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  useEffect(() => {
    const getIpAddress = async () => {
      const response = await fetch('https://api.ipify.org/?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    };
    getIpAddress();
  }, []);
  const [committee, setCommittee] = useState({
    name: "",
    email: "",
    password: "",
    photo_url: "",
    soft_delete: false,
    coins: 0
  });

  const handleChange = (e) => {
    setCommittee({ ...committee, [e.target.name]: e.target.value });
  }

  const handlecommitteeImage = async (e) => {
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
        setCommitteeImage(r.data.secure_url);
        toast.success("Image Uploaded Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    committee.photo_url = committeeImage;
    await authGenerate
      .createUserWithEmailAndPassword(committee.email, committee.password)
      .then(async (data) => {
        await db.collection('committees').doc(committee.email).set({
          id: data.user.uid,
          name: committee.name,
          email: committee.email,
          photo_url: committee.photo_url,
          soft_delete: false,
          created_at: new Date().toLocaleString(),
          updated_at: new Date().toLocaleString(),
          coins: 0,
          sponsors: [],
          transactions: [],
          coin_logs: [],
          logs: firebase
            .firestore
            .FieldValue
            .arrayUnion({
              ip: ipAddress,
              date: new Date().toLocaleString(),
              action: "Added Committee",
              user_agent: window.navigator.userAgent,
              device: window.navigator.platform,
              browser: window.navigator.appCodeName,
              browser_version: window.navigator.appVersion,
              browser_online: window.navigator.onLine,
              browser_language: window.navigator.language,
              browser_cookies: window.navigator.cookieEnabled,
            }),
        })
          .then((res) => {
            toast.success("Committee Added Successfully");
            window.location.href = "/view-committees";
          })
          .catch((err) => {
            console.log(err);
          });
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
                  Committee
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
                              Committee Name
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. CSI SAKEC"
                                name="name"
                                required
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Committee Email
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. csi@sakec.ac.in"
                                name="email"
                                required
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Committee Password
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. S@k3c@123"
                                name="password"
                                required
                                onChange={handleChange}
                              />
                            </div>
                          </div>


                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-company"
                            >
                              committee Image / Icon
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile02"
                                required
                                accept=".jpg, .jpeg, .png"
                                onChange={handlecommitteeImage}
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
                                src={committeeImage}
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
                                Add Committee
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

export default AddComittee;
