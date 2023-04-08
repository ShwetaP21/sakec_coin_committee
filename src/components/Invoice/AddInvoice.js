import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Nav from "../Nav";
import "../../App.css";
import { db } from "../../firebase_config";

const AddInvoice = () => {
  const [invoicePDF, setInvoicePDF] = useState(
    "https://brent-mccardle.org/img/placeholder-image.png"
  );

  const [loading, setLoading] = useState(false);

  const [invoice, setInvoice] = useState({
    sid: "",
    pdf: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((event) => {
      return {
        ...event,
        [name]: value,
      };
    });
  };

  const handleinvoicePDF = async (e) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "invoice");

    const dataFile = await fetch(
      "https://api.cloudinary.com/v1_1/dpfxrlyrv/image/upload",
      {
        method: "POST",
        body: data,
      }
    )
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
      });
    if (dataFile.secure_url !== null) {
      setInvoicePDF(dataFile.secure_url);
      toast.success("Invoice Uploaded Successfully");
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    invoice.pdf = invoicePDF;
    db.collection("Services")
      .doc(invoice.sid)
      .update({
        invoice: invoice.pdf,
      })
      .then((res) => {
        toast.success("Invoice Added Successfully");
        window.location.href = "/Invoices";
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
                  invoice
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
                              Service ID
                            </label>
                            <div className="col-sm-10">
                              <input
                                type="text"
                                className="form-control"
                                id="basic-default-name"
                                placeholder="John Doe"
                                name="sid"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              className="col-sm-2 col-form-label"
                              htmlFor="basic-default-company"
                            >
                              Invoice PDF
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile02"
                                accept=".pdf"
                                onChange={handleinvoicePDF}
                              />
                              <br />
                              {loading === true ? (
                                <>
                                  <h4>Uploading Invoice</h4>
                                </>
                              ) : (
                                <></>
                              )}
                          
                            </div>
                          </div>

                          <div className="row justify-content-end">
                            <div className="col-sm-12">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={onSubmit}
                              >
                                Add
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

export default AddInvoice;
