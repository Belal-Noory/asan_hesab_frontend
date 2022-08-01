import React, { useState, useContext, useEffect, useRef } from "react";
import transactionContext from "../../context/bussiness/transaction/transactionContext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Moment from "moment";
import customerContext from "../../context/bussiness/customers/customerContext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import TableExports from "../TableExports";
import LoadingScreen from "react-loading-screen";

function Transactions() {
    const transactionData = useContext(transactionContext);
    const { allTransactions, editTransaction, getTransactions, deleteTransaction, addTransaction } = transactionData;
    const customerData = useContext(customerContext);
    const { allCustomers, getCustomers } = customerData;

    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState("");

    const [loading1, setLoading1] = useState(true);
    const [transactionDialog, setTransactionDialog] = useState(false);
    const [transaction, setTransaction] = useState({
        _id: "",
        customer: "",
        date: "",
        details: "",
        tone_quantity: 0,
        fuel_type: "",
        unit_price: 0,
        t_type: "",
        driver: "",
        palit: "",
        page: "",
    });
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);
    const [loader, setloader] = useState(true);
    // get all drivers
    const [drivers, setdrivers] = useState([]);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        getTransactions();
        getCustomers();
        setLoading1(false);

        let temp = [];
        allTransactions.map((filterd, index) => {
            temp.push(filterd.drive);
        });
        var unique = temp.filter((v, i, a) => a.indexOf(v) === i);
        setdrivers(unique);
        setloader(false);
    }, [editTransaction, deleteTransaction, addTransaction]);

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        _filters1["customer.name"].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const initFilters1 = () => {
        setFilters1({
            "customer.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            fuel_type: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            t_type: { value: null, matchMode: FilterMatchMode.IN },
            drive: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
        });
        setGlobalFilterValue1("");
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined ml-5" onClick={clearFilter1} />
                <span className="p-input-icon-left mr-5">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="جستجو عمومی" />
                </span>
            </div>
        );
    };

    const calculatTotalAmount = (rowData) => {
        return rowData.tone_quantity * rowData.unit_price;
    };

    const formateDate = (rowData) => {
        return Moment(new Date(rowData.date)).format("DD/MM/YYYY");
    };

    const editProduct = (customer) => {
        setTransaction((prevT) => ({
            ...prevT,
            _id: customer._id,
            user: customer.user,
            customer: customer.customer.name,
            date: customer.date,
            details: customer.details,
            tone_quantity: customer.tone_quantity,
            fuel_type: customer.fuel_type,
            unit_price: customer.unit_price,
            t_type: customer.t_type,
            driver: customer.drive,
            palit: customer.palit,
            page: customer.page,
            status: customer.status,
        }));
        setTransactionDialog(true);
    };

    const confirmDeleteProduct = (customer) => {
        setTransaction(customer);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        deleteTransaction(transaction._id);
        toast.current.show({ severity: "success", summary: "توجه", detail: "معامله موفقانه حذف شد", life: 3000 });
        setDeleteProductDialog(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mx-1" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mx-1" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="نخیر" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="بلی" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setTransactionDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (transaction._id) {
            editTransaction(transaction._id, transaction.customer, transaction.details, transaction.tone_quantity, transaction.fuel_type, transaction.unit_price, transaction.t_type, transaction.date, transaction.driver, transaction.palit, transaction.page, transaction.details);
            toast.current.show({ severity: "success", summary: "توجه", detail: "موفقانه اجرا شد", life: 3000 });
        } else {
            if (!Object.values(transaction).every((x) => x === null || x === "")) {
                addTransaction(transaction.customer, transaction.date, transaction.tone_quantity, transaction.unit_price, transaction.fuel_type, transaction.t_type, transaction.details, transaction.driver, transaction.palit, transaction.page, transaction.status);
                toast.current.show({ severity: "success", summary: "توجه", detail: "معامله موفقانه اضعافه شد", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "توجه", detail: "لطفآ فورم را درست خانه پوری کنید.", life: 3000 });
            }
        }
        setTransactionDialog(false);
        setTransaction({ _id: "", user: "", customer: "", date: "", details: "", tone_quantity: "", fuel_type: "", unit_price: "", t_type: "", status: "" });
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="لغوه" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ثبت" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    // update single customer
    const setTransactionValue = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    const openNew = () => {
        setTransaction({ user: "", customer: "", date: "", details: "", tone_quantity: "", fuel_type: "", unit_price: "", t_type: "", driver: "", palit: "", page: "", status: "active" });
        setSubmitted(false);
        setTransactionDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="معامله جدید" icon="pi pi-plus" className="p-button-success mr-2 header" onClick={openNew} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <TableExports
                cols={[
                    { field: "customer.name", header: "Name" },
                    { field: "date", header: "date" },
                    { field: "details", header: "details" },
                    { field: "drive", header: "drive" },
                    { field: "palit", header: "palit" },
                    { field: "page", header: "page" },
                    { field: "fuel_type", header: "fuel_type" },
                    { field: "tone_quantity", header: "tone_quantity" },
                    { field: "unit_price", header: "unit_price" },
                    { field: "t_type", header: "t_type" },
                    { field: "fuel_type", header: "fuel_type" },
                ]}
                data={allTransactions}
                dt={dt}
                title="معاملات"
            />
        );
    };

    const header1 = renderHeader1();
    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="grid">
                <div className="datatable-filter-demo col-12">
                    <div className="card p-fluid" dir="rtl">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable
                            ref={dt}
                            value={allTransactions}
                            paginator
                            className="p-datatable-customers"
                            showGridlines
                            rows={10}
                            dataKey="_id"
                            filters={filters1}
                            filterDisplay="menu"
                            loading={loading1}
                            responsiveLayout="scroll"
                            globalFilterFields={["customer.name"]}
                            header={header1}
                            emptyMessage="معاملات موجود نیست"
                            size="small"
                        >
                            <Column field="customer.name" header="مشتری" filter filterPlaceholder="جستجوی مشتری" className="text-right" />
                            <Column field="date" header="تاریخ" body={formateDate} filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column field="details" header="تفصیلات" />
                            <Column field="drive" header="اسم دریور" filter filterPlaceholder="جستجو" />
                            <Column field="palit" header="نمبر پلیت" />
                            <Column field="page" header="صفحه" />
                            <Column field="fuel_type" header="نوعیت مایع" filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column field="tone_quantity" header="مقدار تون" className="text-right" />
                            <Column field="unit_price" header="فی تون" className="text-right" />
                            <Column field="t_type" header="نوعیت پول" filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column header="مجموعآ پول" body={calculatTotalAmount} className="text-right" />
                            <Column body={actionBodyTemplate} exportable={false}></Column>
                        </DataTable>
                    </div>
                    {/* dialoges for editing and adding */}
                    <Dialog visible={transactionDialog} style={{ width: "450px" }} header="مشخصات مشتری" modal className="p-fluid text-right" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="p-fluid grid" dir="rtl">
                            <div className="field col-12  " dir="ltr">
                                <span className="p-float-label">
                                    <Dropdown value={transaction.customer} optionValue="_id" options={allCustomers} optionLabel="name" onChange={setTransactionValue} name="customer" id="customer" inputId="customer" filter required />
                                    <label htmlFor="customer">مشتری</label>
                                </span>
                            </div>

                            <div className="field col-12  ">
                                <span className="p-float-label">
                                    <Calendar value={transaction.date} onChange={setTransactionValue} name="date" id="date" required></Calendar>
                                    <label htmlFor="date">تاریخ</label>
                                </span>
                            </div>

                            <div className="field col-12  ">
                                <span className="p-float-label">
                                    <InputNumber value={transaction.tone_quantity} onValueChange={setTransactionValue} mode="decimal" name="tone_quantity" id="tone_quantity" required />
                                    <label htmlFor="tone_quantity">مقدار تن</label>
                                </span>
                            </div>

                            <div className="field col-12  ">
                                <span className="p-float-label">
                                    <InputNumber value={transaction.unit_price} onValueChange={setTransactionValue} mode="decimal" name="unit_price" id="unit_price" required />
                                    <label htmlFor="unit_price">فی تن</label>
                                </span>
                            </div>

                            <div className="field col-12  " dir="ltr">
                                <span className="p-float-label">
                                    <Dropdown value={transaction.fuel_type} optionValue="name" options={[{ name: "پطرول" }, { name: "دیزل" }, { name: "گاز" }]} optionLabel="name" onChange={setTransactionValue} name="fuel_type" id="fuel_type" filter required />
                                    <label htmlFor="fuel_type">نوعیت مایع</label>
                                </span>
                            </div>

                            <div className="field col-12  " dir="ltr">
                                <span className="p-float-label">
                                    <Dropdown value={transaction.t_type} optionValue="name" options={[{ name: "طلب شرکت" }, { name: "باقی شرکت" }]} optionLabel="name" onChange={setTransactionValue} name="t_type" id="t_type" filter required />
                                    <label htmlFor="t_type">نوعیت پول</label>
                                </span>
                            </div>
                            <div className="field col-12">
                                <span className="p-float-label">
                                    <InputText value={transaction.driver} onChange={setTransactionValue} name="driver" id="driver" list="driversList" />
                                    <datalist id="driversList">
                                        {drivers.map((filterd, index) => {
                                            return <option key={index} value={filterd} />;
                                        })}
                                    </datalist>
                                    <label htmlFor="driver">اسم دریور</label>
                                </span>
                            </div>

                            <div className="field col-12" dir="ltr">
                                <span className="p-float-label">
                                    <InputText value={transaction.palit} onChange={setTransactionValue} name="palit" id="palit" />
                                    <label htmlFor="palit">نمبر پلیت</label>
                                </span>
                            </div>

                            <div className="field col-12" dir="ltr">
                                <span className="p-float-label">
                                    <InputText value={transaction.page} onChange={setTransactionValue} name="page" id="page" />
                                    <label htmlFor="page">صفحه</label>
                                </span>
                            </div>
                            <div className="field col-12 md:col-12">
                                <span className="p-float-label">
                                    <InputTextarea cols={30} value={transaction.details} onChange={setTransactionValue} name="details" id="details" required />
                                    <label htmlFor="details">تفصیلات</label>
                                </span>
                            </div>
                        </div>
                    </Dialog>

                    {/* delete confirmation dialogue */}
                    <Dialog visible={deleteProductDialog} className="text-right" style={{ width: "450px" }} header="موفق هیتید؟" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {transaction && <span>آیا مطمین هستید؟</span>}
                        </div>
                    </Dialog>

                    <Toast ref={toast} />
                </div>
            </div>
        </LoadingScreen>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(Transactions, comparisonFn);
