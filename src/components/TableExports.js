import React from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

function TableExports(props) {
    const { cols, data, title, dt } = props;

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly }, title);
    };

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, data);
                doc.save(title + ".pdf");
            });
        });
    };

    const print = () => {};

    return (
        <>
            <div className="flex align-items-center export-buttons">
                <Button type="button" icon="pi pi-file-excel" onClick={() => exportCSV(false)} className="p-button-success mr-2 mx-1" data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning mr-2 mx-1" data-pr-tooltip="PDF" />
                <Button type="button" icon="pi pi-print" onClick={print} className="p-button-danger mr-2 mx-1" data-pr-tooltip="PDF" />
            </div>
            <Tooltip target=".export-buttons>button" position="bottom" />
        </>
    );
}

export default TableExports;
