import React, { useContext, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import customerContext from "../../context/bussiness/customers/customerContext";
import TableExports from "../TableExports";
import LoadingScreen from "react-loading-screen";

function Staffs() {
    let emptyCustomer = {
        id: null,
        name: "",
        phone: "",
    };

    const customerData = useContext(customerContext);
    const { allStaffs, deleteCustomer, getStaffs, addStaff, editCustomer, deleteCustomers } = customerData;

    const [productDialog, setCustomerDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [customer, setCustomer] = useState(emptyCustomer);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loader, setloader] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        getStaffs();
        // eslint-disable-next-line
        setloader(false);
    }, [addStaff]);

    const openNew = () => {
        setCustomer(emptyCustomer);
        setSubmitted(false);
        setCustomerDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCustomerDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (customer.name.trim()) {
            if (customer._id) {
                editCustomer(customer._id, customer.name, customer.phone);
                toast.current.show({ severity: "success", summary: "توجه", detail: "موفقانه اجرا شد", life: 3000 });
            } else {
                addStaff(customer.name, customer.phone);
                toast.current.show({ severity: "success", summary: "توجه", detail: "مشتری موفقانه اضعافه شد", life: 3000 });
            }

            setCustomerDialog(false);
            setCustomer(emptyCustomer);
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...customer };
        _product[`${name}`] = val;
        setCustomer(_product);
    };

    const editProduct = (customer) => {
        setCustomer({ ...customer });
        setCustomerDialog(true);
    };

    const confirmDeleteProduct = (customer) => {
        setCustomer(customer);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        deleteCustomer(customer._id);
        toast.current.show({ severity: "success", summary: "توجه", detail: "مشتری موفقانه حذف شد", life: 3000 });
        setDeleteProductDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        let IDS = [];
        selectedProducts.forEach((element) => {
            IDS.push(element._id);
        });
        deleteCustomers(IDS);
        toast.current.show({ severity: "success", summary: "موفقانه اجرا شد", detail: "همه مشتریان انتخاب شده موفقانه حذف شد", life: 3000 });
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="مشتری جدید" icon="pi pi-plus" className="p-button-success mr-2 header" onClick={openNew} />
                <Button label="حذف" icon="pi pi-trash" className="p-button-danger mr-2 header" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <TableExports
                cols={[
                    { field: "name", header: "Name" },
                    { field: "phone", header: "Phone" },
                ]}
                data={allStaffs}
                dt={dt}
                title="کارمندان"
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mx-1" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mx-1" onClick={() => confirmDeleteProduct(rowData)} />
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

    const productDialogFooter = (
        <React.Fragment>
            <Button label="لغوه" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ثبت" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="نخیر" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="بلی" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="نخیر" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="بلی" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="datatable-crud-demo" dir="rtl">
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={allStaffs}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="از {first} تا {last} مجموعه {totalRecords} کارمندان"
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                        className="text-right"
                        size="small"
                        scrollHeight="460px"
                    >
                        <Column selectionMode="multiple" exportable={false} className="text-right"></Column>
                        <Column field="name" header="کارمند" sortable className="text-right"></Column>
                        <Column field="phone" header="شماره تماس" sortable className="text-right"></Column>
                        <Column body={actionBodyTemplate} exportable={false}></Column>
                    </DataTable>
                </div>

                <Dialog visible={productDialog} style={{ width: "450px" }} header="مشخصات کارمند" modal className="p-fluid text-right" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name">اسم کارمند</label>
                        <InputText id="name" name="name" value={customer.name} onChange={(e) => onInputChange(e, "name")} required autoFocus className={classNames({ "p-invalid": submitted && !customer.name })} dir="rtl" />
                        {submitted && !customer.name && <small className="p-error">اسم کارمند ضروری است</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="phone">شماره تماس</label>
                        <InputText id="phone" name="phone" value={customer.phone} onChange={(e) => onInputChange(e, "phone")} required autoFocus className={classNames({ "p-invalid": submitted && !customer.phone })} dir="rtl" />
                        {submitted && !customer.phone && <small className="p-error">شماره کارمند ضروری است</small>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                        {customer && (
                            <span>
                                را از سیستم حذف کنید؟ <b>{customer.name}</b> آیا مطمین هستید تا
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                        {customer && <span>آیا مطمین هستید؟</span>}
                    </div>
                </Dialog>
            </div>
        </LoadingScreen>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Staffs, comparisonFn);
