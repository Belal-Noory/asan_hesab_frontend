import React, { useState, useContext, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import transactionContext from "../../context/bussiness/transaction/transactionContext";
import customerContext from "../../context/bussiness/customers/customerContext";

function AddTransaction() {
    // bussiness data global context
    const transactionData = useContext(transactionContext);
    const customerData = useContext(customerContext);

    // get just add customer context
    const { addTransaction, getTransactions, allTransactions } = transactionData;
    const { allCustomers, getCustomers, addCustomer } = customerData;
    const toast = useRef(null);

    // Create state for a single customer to add
    const [transaction, setTransaction] = useState({
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

    // get all drivers
    const [drivers, setdrivers] = useState([]);
    const [Spinner, setSpinner] = useState(false);

    // function to add/save customer
    const saveTransaction = async (e) => {
        if (!Object.values(transaction).every((x) => x === null || x === "")) {
            setSpinner(true);
            let cas = await addTransaction(transaction.customer, transaction.date, transaction.tone_quantity, transaction.unit_price, transaction.fuel_type, transaction.t_type, transaction.details, transaction.driver, transaction.palit, transaction.page);
            if (!("errors" in cas)) {
                toast.current.show({
                    severity: "success",
                    summary: "درج معامله",
                    detail: "معامله شما موفقانه درج سیستم شد",
                });
                transaction.customer = "";
                transaction.date = "";
                transaction.tone_quantity = "";
                transaction.unit_price = "";
                transaction.fuel_type = "";
                transaction.t_type = "";
                transaction.details = "";
                transaction.driver = "";
                transaction.palit = "";
                transaction.page = "";
                setSpinner(false);
            } else {
                const erros = cas.errors;
                const result = Array();
                for (let i = 0; i < erros.length; i++) {
                    let textbox = "";
                    switch (erros[i].param) {
                        case "customer":
                            textbox = "اسم مشری";
                            break;
                        case "details":
                            textbox = "تفصیلات";
                            break;
                        case "tone_quantity":
                            textbox = "مقدار تون";
                            break;
                        case "fuel_type":
                            textbox = "نوعیت مایع";
                            break;
                        case "unit_price":
                            textbox = "فی تن";
                            break;
                        case "t_type":
                            textbox = "نوعیت پول";
                            break;
                        default:
                            break;
                    }
                    result.push({
                        severity: "error",
                        summary: textbox,
                        detail: erros[i].msg,
                    });
                }
                toast.current.show(result);
                setSpinner(false);
            }
        } else {
            setSpinner(false);
            toast.current.show({
                severity: "error",
                summary: "خطا",
                detail: "لطفآ تمام معلومات را درست خانه پوری نمایدن.",
            });
        }
    };

    useEffect(() => {
        getCustomers();
        getTransactions();
        let temp = [];
        allTransactions.map((filterd, index) => {
            temp.push(filterd.drive);
        });
        var unique = temp.filter((v, i, a) => a.indexOf(v) === i);
        setdrivers(unique);
    }, [addTransaction]);

    // update single customer
    const setTransactionValue = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid">
            <div className="col-12" dir="rtl">
                <Card className="card p-fluid" title="حساب جدید">
                    <div className="p-fluid grid">
                        <div className="field col-12 md:col-4" dir="ltr">
                            <span className="p-float-label">
                                <Dropdown value={transaction.customer} optionValue="_id" options={allCustomers} optionLabel="name" onChange={setTransactionValue} name="customer" id="customer" inputId="customer" filter required />
                                <label htmlFor="customer">مشتری</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <Calendar value={transaction.date} onChange={setTransactionValue} name="date" id="date" required></Calendar>
                                <label htmlFor="date">تاریخ</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="number" value={transaction.tone_quantity} onChange={setTransactionValue} name="tone_quantity" id="tone_quantity" required />
                                <label htmlFor="tone_quantity">مقدار تن</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="number" value={transaction.unit_price} onChange={setTransactionValue} name="unit_price" id="unit_price" required />
                                <label htmlFor="unit_price">فی تن</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4" dir="ltr">
                            <span className="p-float-label">
                                <Dropdown value={transaction.fuel_type} optionValue="name" options={[{ name: "پطرول" }, { name: "دیزل" }, { name: "گاز" }]} optionLabel="name" onChange={setTransactionValue} name="fuel_type" id="fuel_type" filter required />
                                <label htmlFor="fuel_type">نوعیت مایع</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4" dir="ltr">
                            <span className="p-float-label">
                                <Dropdown value={transaction.t_type} optionValue="name" options={[{ name: "طلب شرکت" }, { name: "باقی شرکت" }]} optionLabel="name" onChange={setTransactionValue} name="t_type" id="t_type" filter required />
                                <label htmlFor="t_type">نوعیت پول</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4">
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

                        <div className="field col-12 md:col-4" dir="ltr">
                            <span className="p-float-label">
                                <InputText value={transaction.palit} onChange={setTransactionValue} name="palit" id="palit" />
                                <label htmlFor="palit">نمبر پلیت</label>
                            </span>
                        </div>

                        <div className="field col-12 md:col-4" dir="ltr">
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
                        <Button label="ثبت معامله" loading={Spinner} onClick={saveTransaction} />
                    </div>
                </Card>
            </div>
            <Toast ref={toast} position="bottom-left" dir="ltr" className="text-right" />
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(AddTransaction, comparisonFn);
