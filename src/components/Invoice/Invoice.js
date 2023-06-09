/* eslint-disable react-hooks/exhaustive-deps */
import "./Invoice.css";
import React from "react";
import logo from '../../images/sakec.png'
import { db } from "../../firebase_config";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { id } = useParams();
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    getInvoiceData();
  }, []);

  const getInvoiceData = async () => {
    await db
      .collection("requests")
      .doc(id)
      .get()
      .then((doc) => {
        setData(doc.data());
      });
  }
  return (
    <div className="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr className="top">
          <td colspan="2">
            <table>
              <tr>
                <td className="title">
                  <img alt="logo" src={logo} style={
                    { width: "20%", maxWidth: "300px" }
                  } />
                </td>

                <td>
                  Invoice #: {id}<br />
                  Created: {data.date}<br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr className="information">
          <td colspan="2">
            <table>
              <tr>
                <td>
                  SAKEC Credit.<br />
                  Generated by<br />
                  admin@sakec.ac.in
                  <br />
                  for <br />
                  {data.email}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr className="heading">
          <td>Generation Reason</td>
        </tr>

        <tr className="details">
          <td>{data.reason}</td>
        </tr>

        <tr className="heading">
          <td>Type</td>

          <td>Credits</td>
        </tr>

        <tr className="item">
          <td> {data.status}</td>

          <td>{data.amount}</td>
        </tr>

        <tr className="total">
          <td></td>

          <td>Total: {data.amount}</td>
        </tr>
      </table>
    </div>
  );
};

export default Invoice;
