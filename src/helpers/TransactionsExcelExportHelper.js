import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const TransactionsExcelExportHelper = ({ data }) => {
    const createDownloadtransactionDetails = () => {
        handleExport().then((url) => {
            console.log(url);
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", `transactions.xlsx`);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    };

    const workbook2blob = (workbook) => {
        const wopts = {
            bookType: "xlsx",
            bookSST: false,
            type: "binary",
        };

        const wbout = XLSX.write(workbook, wopts);

        // The application/octet-stream MIME type is used for unknown binary files.
        // It preserves the file contents, but requires the receiver to determine file type,
        // for example, from the filename extension.
        const blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream",
        });

        return blob;
    };

    const s2ab = (s) => {
        // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
        // create an ArrayBuffer with a size in bytes
        const buf = new ArrayBuffer(s.length);

        console.log(buf);

        //create a 8 bit integer array
        const view = new Uint8Array(buf);

        console.log(view);
        //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
        for (let i = 0; i !== s.length; ++i) {
            console.log(s.charCodeAt(i));
            view[i] = s.charCodeAt(i);
        }

        return buf;
    };

    const handleExport = () => {
        const title = [{ A: `Transactions` }, {}];

        let table1 = [
            {
                A: "Id No.",
                B: "Date.",
                C: "Amount",
                D: "Type",
                E: "Reason",
            },
        ];

        data.forEach((row, index) => {
            const transactionDetails = row;

            table1.push({
                A: index + 1,
                B: transactionDetails.date,
                C: transactionDetails.coins,
                D: transactionDetails.deposit === true ? 'Deposit' : 'Withdrawal',
                E: transactionDetails.reason
            });
        });

        table1 = [{ A: "Transaction Details" }]
            .concat(table1)
            .concat([""])

        const finaltransactionDetails = [...title, ...table1];

        console.log(finaltransactionDetails);

        //create a new workbook
        const wb = XLSX.utils.book_new();

        const sheet = XLSX.utils.json_to_sheet(finaltransactionDetails, {
            skipHeader: true,
        });

        XLSX.utils.book_append_sheet(wb, sheet, "transactions_report");

        // binary large object
        // Since blobs can store binary transactionDetails, they can be used to store images or other multimedia files.

        const workbookBlob = workbook2blob(wb);

        var headerIndexes = [];
        finaltransactionDetails.forEach((data, index) =>
            data["A"] === "Id No." ? headerIndexes.push(index) : null
        );

        const totalRecords = data.length;

        const transactionDetailsInfo = {
            titleCell: "A2",
            titleRange: "A1:E2",
            tbodyRange: `A3:E${finaltransactionDetails.length}`,
            theadRange:
                headerIndexes?.length >= 1
                    ? `A${headerIndexes[0] + 1}:E${headerIndexes[0] + 1}`
                    : null,
            tFirstColumnRange:
                headerIndexes?.length >= 1
                    ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
                    : null,
            tLastColumnRange:
                headerIndexes?.length >= 1
                    ? `E${headerIndexes[0] + 1}:E${totalRecords + headerIndexes[0] + 1}`
                    : null,
        };

        return addStyle(workbookBlob, transactionDetailsInfo);
    };

    const addStyle = (workbookBlob, transactionDetailsInfo) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
            workbook.sheets().forEach((sheet) => {
                sheet.usedRange().style({
                    fontFamily: "Arial",
                    verticalAlignment: "center",
                });

                sheet.column("A").width(15);
                sheet.column("B").width(15);
                sheet.column("C").width(15);
                sheet.column("D").width(15);
                sheet.column("E").width(40);

                sheet.range(transactionDetailsInfo.titleRange).merged(true).style({
                    bold: true,
                    horizontalAlignment: "center",
                    verticalAlignment: "center",
                });

                if (transactionDetailsInfo.tbodyRange) {
                    sheet.range(transactionDetailsInfo.tbodyRange).style({
                        horizontalAlignment: "center",
                    });
                }

                sheet.range(transactionDetailsInfo.theadRange).style({
                    fill: "FFFD04",
                    bold: true,
                    horizontalAlignment: "center",
                });

            });

            return workbook
                .outputAsync()
                .then((workbookBlob) => URL.createObjectURL(workbookBlob));
        });
    };

    return (
        <button
            className="btn btn-success"
            onClick={() => {
                createDownloadtransactionDetails();
            }}
        >
            Export
        </button>
    );
};

export default TransactionsExcelExportHelper;