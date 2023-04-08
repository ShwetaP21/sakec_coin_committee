import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";

const ExcelExportHelper = ({ data, name }) => {
    const createDownloadCommitteeDetails = () => {
        handleExport().then((url) => {
            console.log(url);
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", `${name}.xlsx`);
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
        const title = [{ A: `${name} Committee` }, {}];

        let table1 = [
            {
                A: "Log No.",
                B: "Date.",
                C: "Action",
                D: "IP",
                E: "User Agent",
                F: "Browser",
                G: "Device",
                H: "Browser Language",
                I: "Browser Version",
                J: "Browser Cookie"
            },
        ];

        data.forEach((row, index) => {
            const committeeDetails = row;

            table1.push({
                A: index + 1,
                B: committeeDetails.date,
                C: committeeDetails.action,
                D: committeeDetails.ip,
                E: committeeDetails.user_agent,
                F: committeeDetails.browser,
                G: committeeDetails.device,
                H: committeeDetails.browser_language,
                I: committeeDetails.browser_version,
                J: committeeDetails.browser_cookies,
            });
        });

        table1 = [{ A: "Logs Details" }]
            .concat(table1)
            .concat([""])

        const finalcommitteeDetails = [...title, ...table1];

        console.log(finalcommitteeDetails);

        //create a new workbook
        const wb = XLSX.utils.book_new();

        const sheet = XLSX.utils.json_to_sheet(finalcommitteeDetails, {
            skipHeader: true,
        });

        XLSX.utils.book_append_sheet(wb, sheet, "committee_logs_report");

        // binary large object
        // Since blobs can store binary committeeDetails, they can be used to store images or other multimedia files.

        const workbookBlob = workbook2blob(wb);

        var headerIndexes = [];
        finalcommitteeDetails.forEach((data, index) =>
            data["A"] === "Log No." ? headerIndexes.push(index) : null
        );

        const totalRecords = data.length;

        const committeeDetailsInfo = {
            titleCell: "A2",
            titleRange: "A1:J2",
            tbodyRange: `A3:J${finalcommitteeDetails.length}`,
            theadRange:
                headerIndexes?.length >= 1
                    ? `A${headerIndexes[0] + 1}:J${headerIndexes[0] + 1}`
                    : null,
            tFirstColumnRange:
                headerIndexes?.length >= 1
                    ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
                    : null,
            tLastColumnRange:
                headerIndexes?.length >= 1
                    ? `J${headerIndexes[0] + 1}:J${totalRecords + headerIndexes[0] + 1}`
                    : null,
        };

        return addStyle(workbookBlob, committeeDetailsInfo);
    };

    const addStyle = (workbookBlob, committeeDetailsInfo) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
            workbook.sheets().forEach((sheet) => {
                sheet.usedRange().style({
                    fontFamily: "Arial",
                    verticalAlignment: "center",
                });

                sheet.column("A").width(15);
                sheet.column("B").width(26);
                sheet.column("C").width(15);
                sheet.column("D").width(15);
                sheet.column("E").width(12);
                sheet.column("F").width(17);
                sheet.column("G").width(17);
                sheet.column("H").width(12);
                sheet.column("I").width(12);
                sheet.column("J").width(15);

                sheet.range(committeeDetailsInfo.titleRange).merged(true).style({
                    bold: true,
                    horizontalAlignment: "center",
                    verticalAlignment: "center",
                });

                if (committeeDetailsInfo.tbodyRange) {
                    sheet.range(committeeDetailsInfo.tbodyRange).style({
                        horizontalAlignment: "center",
                    });
                }

                sheet.range(committeeDetailsInfo.theadRange).style({
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
                createDownloadCommitteeDetails();
            }}
        >
            Export
        </button>
    );
};

export default ExcelExportHelper;