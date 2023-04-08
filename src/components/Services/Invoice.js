/* eslint-disable no-dupe-keys */
import React from "react";
import { Document, Page, Text, StyleSheet, Image } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import header from './../../images/header.png';
import paid from './../../images/paid.png';
import stamp from './../../images/car-service-logo.png';
import sign from './../../images/stamp.jpeg';


const Invoice = ({ service }) => {
  console.log("serviceeeeeeeeeeeeee", service);
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.header} fixed>
          ~ {new Date().toLocaleString()} ~
        </Text>
        <Image style={styles.header} src={header} />
        <Text style={styles.title}>Service Invoice</Text>
        <Text style={styles.subtitle}>Service Summary</Text>
        <Table>
          <TableHeader>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
          </TableHeader>
        </Table>

        <Table data={service.services}>
          <TableBody>
            <DataTableCell getContent={(r) => r.name} />
            <DataTableCell getContent={(r) => r.price} />
          </TableBody>
        </Table>

        <Text style={styles.subtitle}>Customer & Service Info</Text>


        <Text style={styles.text}>
          <Text>
            Name: {"               "}
            {service.name}
          </Text>
          {"\n"}
          <Text>
            Email: {"                "}
            {service.email}
          </Text>
          {"\n"}
          <Text>
            Contact No.: {"      "}
            {service.phone}
          </Text>
          {"\n"}
          <Text>
            Address: {"            "}
            {service.location}
          </Text>
          {"\n"}
          {/* <Text>
          Date: {"                 "}
          {new Date(service.createdAt).toLocaleString()}
        </Text>
        {"\n"} */}
          <Text>
            Service Id: {"         "}
            {service.id}
          </Text>
          {"\n"}
          <Text>
            Service Status: {"  "}
            {service.status}
          </Text>
          {"\n"}
          <Text>
            Total Paid : {"         Rs."}
            {service.services.reduce(function (tot, arr) {
              // return the sum with previous value
              return tot + parseInt(arr.price);

              // set initial value as 0
            }, 0)}
          </Text>
        </Text>


        <Image style={styles.paid} src={paid} />
        <Text style={styles.bttext}>Paid {"\n"} stamped By Mr.Satish Prajapati (Owner)</Text>
        <Image style={styles.stamp} src={stamp} />
        <Image style={styles.link} src={sign} />


        <Text style={styles.footer}> ~ Thank you for trusting us ~ </Text>

        <Text style={styles.vvl}><Image style={styles.vl} src={stamp} /> ~ Powered By SP Autoworks ~ {"\n"} ~Mail to service@gmail.com to connect with us~ </Text>

      </Page>
    </Document>
  );
}
const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    width: "auto",
    height: 120,
  },
  vl: {
    height: 50,
    width: 50,
  },
  vvl: {
    fontSize: 13,
  },
  paid: {
    height: 50,
    width: 50,
    marginLeft: 400,
  },
  stamp: {
    height: 50,
    width: 50,
    marginLeft: 380,
  },
  link: {
    height: 50,
    width: 50,
    marginTop: -48,
    marginLeft: 450,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  bttext: {
    fontSize: 10,
    marginLeft: 340,
  },
  header: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "grey",
  },

  footer: {
    marginTop: 5,
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
export default Invoice;
