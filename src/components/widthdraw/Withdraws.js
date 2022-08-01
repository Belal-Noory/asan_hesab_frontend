import React, { useState, useContext, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import withdrawContext from "../../context/bussiness/withdraw/withdrawContext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toolbar } from "primereact/toolbar";
import shareholderContext from "../../context/bussiness/shareholders/shareholderContext";
import { classNames } from "primereact/utils";
import moment from "moment";
import TableExports from "../TableExports";
import LoadingScreen from "react-loading-screen";

function Withdraws() {
    const withdrawData = useContext(withdrawContext);
    const { allwithdraws, getWithdraws, addWithdraw } = withdrawData;
    const shareholderData = useContext(shareholderContext);
    const { allHolders, getHolders } = shareholderData;

    const [loading1, setLoading1] = useState(true);
    const [transactionDialog, setTransactionDialog] = useState(false);
    const [transaction, setTransaction] = useState({ _id: "", holder: "", date: "", amount: "", type: "", details: "" });
    const [submitted, setSubmitted] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [loader, setloader] = useState(true);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        getWithdraws();
        getHolders();
        setLoading1(false);
        setloader(false);
    }, [addWithdraw]);

    const hideDialog = () => {
        setSubmitted(false);
        setTransactionDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (!Object.values(transaction).every((x) => x === null || x === "" || x === 0)) {
            addWithdraw(transaction.holder, transaction.date, transaction.amount, transaction.type, transaction.details);
            toast.current.show({ severity: "success", summary: "توجه", detail: "برداشت موفقانه اضعافه شد", life: 3000 });
            setTransactionDialog(false);
            setTransaction({ _id: "", holder: "", date: "", amount: "", type: "", details: "" });
        } else {
            setTransaction({ _id: "", holder: "", date: "", amount: "", type: "", details: "" });
            toast.current.show({ severity: "error", summary: "توجه", detail: "لطفآ فورم را بشکل درست خانه پوری نماید.", life: 3000 });
        }
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="لغوه" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ثبت" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );

    // update single customer
    const setTransactionValue = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    const openNew = () => {
        setTransaction({ _id: "", holder: "", date: "", amount: "", type: "", details: "" });
        setSubmitted(false);
        setTransactionDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="برداشت جدید" icon="pi pi-plus" className="p-button-success mr-2 header" onClick={openNew} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <TableExports
                cols={[
                    { field: "holder.name", header: "Name" },
                    { field: "date", header: "Date" },
                    { field: "details", header: "Details" },
                    { field: "amount", header: "Amount" },
                    { field: "type", header: "Type" },
                ]}
                data={allwithdraws}
                dt={dt}
                title="برداشت شریکان"
            />
        );
    };

    const headerTemplate = (data) => {
        return (
            <>
                <span className="image-text text-right">{data.holder.name}</span>
            </>
        );
    };

    const calculateCustomerTotal = (id, type) => {
        let total = 0;
        allwithdraws
            .filter((tran) => tran.holder._id === id && tran.type === type)
            .forEach((filterd) => {
                total += filterd.amount;
            });
        return total;
    };

    const formatDate = (rowData) => {
        return moment(Date(rowData.date)).format("d/m/Y");
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="1" style={{ textAlign: "right", backgroundColor: "lightgray" }} className="text-center">
                    مجموعه افغانی
                </td>
                <td style={{ backgroundColor: "lightgray" }} className="text-center">
                    {calculateCustomerTotal(data.holder._id, "افغانی")}
                </td>
                <td colSpan="2" style={{ textAlign: "right", backgroundColor: "lightgray" }} className="text-center">
                    مجموعه دالر
                </td>
                <td style={{ backgroundColor: "lightgray" }} className="text-center">
                    {calculateCustomerTotal(data.holder._id, "دالر")}
                </td>
            </React.Fragment>
        );
    };

    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="grid">
                <div className="datatable-filter-demo col-12">
                    <div className="card p-fluid" dir="rtl">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <div className="card col-12" dir="rtl">
                            <h5>لیست عمومی برداشت های شرکت</h5>
                            <DataTable
                                ref={dt}
                                value={allwithdraws}
                                rowGroupMode="subheader"
                                groupRowsBy="holder.name"
                                sortMode="single"
                                sortField="holder.name"
                                sortOrder={1}
                                responsiveLayout="scroll"
                                expandableRowGroups
                                expandedRows={expandedRows}
                                loading={loading1}
                                onRowToggle={(e) => setExpandedRows(e.data)}
                                rowGroupHeaderTemplate={headerTemplate}
                                rowGroupFooterTemplate={footerTemplate}
                                className="text-center"
                            >
                                <Column field="holder.name" header="اسم" className="text-right"></Column>
                                <Column field="date" header="تاریخ" body={formatDate} className="text-right"></Column>
                                <Column field="details" header="تفصیلات" className="text-right"></Column>
                                <Column field="amount" header="مقدار" className="text-right"></Column>
                                <Column field="type" header="پول" className="text-right"></Column>
                            </DataTable>
                        </div>
                    </div>
                    {/* dialoges for editing and adding */}
                    <Dialog visible={transactionDialog} style={{ width: "450px" }} header="مشخصات برداشت" modal className="p-fluid text-right" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="p-fluid grid">
                            <div className="p-fluid grid" dir="rtl">
                                <div className="field col-12 md:col-6" dir="ltr">
                                    <span className="p-float-label">
                                        <Dropdown value={transaction.holder} optionValue="_id" options={allHolders} optionLabel="name" onChange={setTransactionValue} name="holder" id="holder" filter required className={classNames({ "p-invalid": submitted && !transaction.holder })} />
                                        <label htmlFor="kind">شریک یا کارمند</label>
                                        {submitted && !transaction.holder && <small className="p-error">اسم شریک ضروری است</small>}
                                    </span>
                                </div>
                                <div className="field col-12 md:col-6">
                                    <span className="p-float-label">
                                        <Calendar value={transaction.date} onChange={setTransactionValue} name="date" id="date" required className={classNames({ "p-invalid": submitted && !transaction.date })}></Calendar>
                                        <label htmlFor="date">تاریخ</label>
                                        {submitted && !transaction.amount && <small className="p-error">تاریخ ضروری است</small>}
                                    </span>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <span className="p-float-label">
                                        <InputNumber value={transaction.amount} onValueChange={setTransactionValue} mode="decimal" name="amount" id="amount" required className={classNames({ "p-invalid": submitted && !transaction.amount })} />
                                        <label htmlFor="amount">مقدار پول</label>
                                        {submitted && !transaction.amount && <small className="p-error">مقدار پول ضروری است</small>}
                                    </span>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <span className="p-float-label" dir="ltr">
                                        <Dropdown
                                            value={transaction.type}
                                            optionValue="name"
                                            options={[{ name: "دالر" }, { name: "افغانی" }]}
                                            optionLabel="name"
                                            onChange={setTransactionValue}
                                            name="type"
                                            id="type"
                                            filter
                                            required
                                            className={classNames({ "p-invalid": submitted && !transaction.type })}
                                        />
                                        <label htmlFor="type">نوعیت پول</label>
                                        {submitted && !transaction.type && <small className="p-error">نوعیت پول ضروری است</small>}
                                    </span>
                                </div>

                                <div className="field col-12 md:col-12">
                                    <span className="p-float-label">
                                        <InputTextarea cols={30} value={transaction.details} onChange={setTransactionValue} name="details" id="details" required className={classNames({ "p-invalid": submitted && !transaction.details })} />
                                        <label htmlFor="details">تفصیلات</label>
                                        {submitted && !transaction.details && <small className="p-error">تفصیلات ضروری است</small>}
                                    </span>
                                </div>
                            </div>
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
export default React.memo(Withdraws, comparisonFn);
