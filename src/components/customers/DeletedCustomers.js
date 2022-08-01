import React, { useContext, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import customerContext from "../../context/bussiness/customers/customerContext";
import LoadingScreen from "react-loading-screen";

function DeletedCustomers() {
    let emptyCustomer = {
        id: null,
        name: "",
        phone: "",
    };

    const customerData = useContext(customerContext);
    const { allCustomers, getDeletedCustomers, undoDeletedCustomer } = customerData;
    const [loader, setloader] = useState(true);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [customer, setCustomer] = useState(emptyCustomer);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        getDeletedCustomers();
        setloader(false);
    }, [undoDeletedCustomer]);

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (customer) => {
        setCustomer(customer);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        undoDeletedCustomer(customer._id);
        toast.current.show({ severity: "success", summary: "توجه", detail: "مشتری موفقانه به سیستم اضعفه شد", life: 3000 });
        setDeleteProductDialog(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="دونلود لیست مشتریان" icon="pi pi-upload" className="p-button-help header" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-undo" className="p-button-rounded p-button-primary mx-1" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">جستجو مشتریان</h5>
            <span className="p-input-icon-left my-2">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="جستجو..." />
            </span>
        </div>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="نخیر" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="بلی" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="datatable-crud-demo" dir="rtl">
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={allCustomers}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="از {first} تا {last} مجموعه {totalRecords} مشتریان"
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                        className="text-right"
                        size="small"
                        scrollHeight="460px"
                    >
                        <Column field="name" header="مشتری" sortable className="text-right"></Column>
                        <Column field="phone" header="شماره تماس" sortable className="text-right"></Column>
                        <Column body={actionBodyTemplate} exportable={false}></Column>
                    </DataTable>
                </div>

                <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                        {customer && <span>آیا مطمین هستید?</span>}
                    </div>
                </Dialog>
            </div>
        </LoadingScreen>
    );
}

export default DeletedCustomers;
