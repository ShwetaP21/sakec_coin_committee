import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import { db } from "../../firebase_config";
import axios from "axios";
import firebase from 'firebase/compat/app'
import { UserAuth } from "../AuthContext";

// const arrayToUpdate = firebase.firestore.FieldValue.arrayUnion(value)

const AddEvents = () => {
  const [eventImage, setEventImage] = useState(
    "https://brent-mccardle.org/img/placeholder-image.png"
  );

  let [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const { user } = UserAuth();

  useEffect(() => {
    const getIpAddress = async () => {
      const response = await fetch('https://api.ipify.org/?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    };
    getIpAddress();
  }, []);
  const [event, setEvent] = useState({
    name: "",
    date: "",
    photo_url: "",
    coordinator_name: "",
    coordinator_phone: "",
    registration_fee: "",
    prize: "",
    soft_delete: false,
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  }

  const handleEventImage = async (e) => {
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
        setEventImage(r.data.secure_url);
        toast.success("Image Uploaded Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    event.photo_url = eventImage;

    await db
      .collection('events')
      .doc(event.name)
      .set({
        name: event.name,
        date: event.date,
        photo_url: event.photo_url,
        coordinator_name: event.coordinator_name,
        coordinator_phone: event.coordinator_phone,
        committee_email: user.email,
        soft_delete: false,
        created_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        coins: 0,
        registrations: [],
        transactions: [],
        registration_fee: parseInt(event.registration_fee),
        prize: parseInt(event.prize),
        logs: firebase
          .firestore
          .FieldValue
          .arrayUnion({
            ip: ipAddress,
            date: new Date().toLocaleString(),
            action: "Added Event",
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
        toast.success("Event Added Successfully");
        window.location.href = "/view-events";
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
                  Event
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
                              Event Title
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. Getting started with XYZ"
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
                              Date
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="date"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. John doe"
                                name="date"
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
                              Event Banner
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile02"
                                required
                                accept=".jpg, .jpeg, .png"
                                onChange={handleEventImage}
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
                                src={eventImage}
                                className="image"
                                alt="uploading_image"
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              Co-ordinator name
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. John doe"
                                name="coordinator_name"
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
                              Registration fee
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="number"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. 100 coins"
                                name="registration_fee"
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
                              Prize
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="number"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. 20 coins"
                                name="prize"
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
                              Co-ordinator contact
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="number"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="Ex. +91 1234567890"
                                name="coordinator_phone"
                                required
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
                                Add Event
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

export default AddEvents;
