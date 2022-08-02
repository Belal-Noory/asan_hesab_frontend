import React, { useState, useContext, useEffect, useRef } from "react";
import expenseContext from "../../context/bussiness/expense/expenseContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Moment from "moment";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import TableExports from "../TableExports";
import LoadingScreen from "react-loading-screen";

function Expenses() {
    const expenseData = useContext(expenseContext);
    const { allExpense, getExpenses, addExpense, deleteExpense, editExpense } = expenseData;

    const [loading1, setLoading1] = useState(true);
    const [transactionDialog, setTransactionDialog] = useState(false);
    const [transaction, setTransaction] = useState({ _id: "", user: "", date: "", details: "", kind: "", amount: "" });
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loader, setloader] = useState(true);
    const dt = useRef(null);
    const toast = useRef(null);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        const getData = async () => {
            await getExpenses();
            setloader(false);
            setLoading1(false);
        };
        getData();
    }, []);

    const formateDate = (rowData) => {
        return Moment(new Date(rowData.date)).format("DD/MM/YYYY");
    };

    const editProduct = (customer) => {
        setTransaction((prevT) => ({
            ...prevT,
            _id: customer._id,
            user: customer.user,
            date: customer.date,
            details: customer.details,
            amount: customer.amount,
            kind: customer.kind,
        }));
        setTransactionDialog(true);
    };

    const confirmDeleteProduct = (customer) => {
        setTransaction(customer);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        deleteExpense(transaction._id);
        toast.current.show({ severity: "success", summary: "توجه", detail: "مصرف موفقانه حذف شد", life: 3000 });
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
            editExpense(transaction._id, transaction.user, transaction.date, transaction.details, transaction.amount, transaction.kind);
            toast.current.show({ severity: "success", summary: "توجه", detail: "موفقانه اجرا شد", life: 3000 });
        } else {
            if (!Object.values(transaction).every((x) => x === null || x === "" || x === 0)) {
                const res = addExpense(transaction.user, transaction.date, transaction.details, transaction.amount, transaction.kind);
                console.log(res);
                toast.current.show({ severity: "success", summary: "توجه", detail: "مصرف موفقانه اضعافه شد", life: 3000 });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "خطا",
                    detail: "لطفآ تمام معلومات را درست خانه پوری نمایدن.",
                });
            }
        }
        setSubmitted(false);
        setTransactionDialog(false);
        setTransaction({ _id: "", user: "", date: "", details: "", amount: "", kind: "" });
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="لغوه" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ثبت" icon={submitted ? "pi pi-spin pi-spinner" : "pi pi-check"} disabled={submitted} className="p-button-text" onClick={saveProduct} />
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
        setTransaction({ user: "", customer: "", date: "", details: "", amount: "", type: "", kind: "" });
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
                    { field: "date", header: "date" },
                    { field: "details", header: "details" },
                    { field: "amount", header: "drive" },
                    { field: "kind", header: "palit" },
                ]}
                data={allExpense}
                dt={dt}
                title="مصارف"
            />
        );
    };

    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="grid">
                <div className="datatable-filter-demo col-12">
                    <div className="card p-fluid" dir="rtl">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable ref={dt} value={allExpense} paginator className="p-datatable-customers" showGridlines rows={10} dataKey="_id" filterDisplay="menu" loading={loading1} responsiveLayout="scroll" emptyMessage="معاملات موجود نیست" size="small">
                            <Column field="date" header="تاریخ" body={formateDate} filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column field="details" header="تفصیلات" />
                            <Column field="amount" header="مقدار پول" className="text-right" />
                            <Column field="kind" header="نوعیت پول" filter filterPlaceholder="جستجو" className="text-right" />
                            <Column body={actionBodyTemplate} exportable={false}></Column>
                        </DataTable>
                    </div>
                    {/* dialoges for editing and adding */}
                    <Dialog visible={transactionDialog} header="مشخصات مصرف" modal className="p-fluid text-right" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="p-fluid grid" dir="rtl">
                            <div className="field col-12 md:col-6">
                                <span className="p-float-label">
                                    <Calendar value={transaction.date} onChange={setTransactionValue} name="date" id="date" required placeholder={"تاریخ"}></Calendar>
                                    <label htmlFor="date">تاریخ</label>
                                </span>
                            </div>

                            <div className="field col-12 md:col-6">
                                <span className="p-float-label">
                                    <InputNumber value={transaction.amount} onValueChange={setTransactionValue} mode="decimal" name="amount" id="amount" required />
                                    <label htmlFor="amount">مقدار پول</label>
                                </span>
                            </div>

                            <div className="field col-12" dir="ltr">
                                <span className="p-float-label">
                                    <Dropdown value={transaction.kind} optionValue="name" options={[{ name: "دالر" }, { name: "افغانی" }]} optionLabel="name" onChange={setTransactionValue} name="kind" id="kind" filter required />
                                    <label htmlFor="kind">نوعیت پول</label>
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
                    </Dialog>{" "}
                    <Toast ref={toast} />
                </div>
            </div>
        </LoadingScreen>
    );
}

export default Expenses;
