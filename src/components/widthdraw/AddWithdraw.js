import React, { useState, useContext, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import shareholderContext from "../../context/bussiness/shareholders/shareholderContext";
import withdrawContext from "../../context/bussiness/withdraw/withdrawContext";

function AddWithdraw() {
    // customer data global context
    const shareholderData = useContext(shareholderContext);
    const { allHolders, getHolders } = shareholderData;
    const withdrawData = useContext(withdrawContext);
    const { addWithdraw } = withdrawData;
    const toast = useRef(null);

    // Create state for a single customer to add
    const [widthdraw, setWidthdraw] = useState({
        holder: "",
        date: "",
        amount: 0,
        details: "",
        type: "",
    });
    const [Spinner, setSpinner] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        getHolders();
    }, []);

    // function to add/save customer
    const saveTransaction = async (e) => {
        setSubmitted(true);
        if (!Object.values(widthdraw).every((x) => x === null || x === "" || x === 0)) {
            setSpinner(true);
            let cas = await addWithdraw(widthdraw.holder, widthdraw.date, widthdraw.amount, widthdraw.type, widthdraw.details);

            if (!("errors" in cas)) {
                toast.current.show({
                    severity: "success",
                    summary: "درج معامله",
                    detail: "مصارف شما موفقانه درج سیستم شد",
                });

                setWidthdraw({
                    holder: "",
                    date: "",
                    amount: 0,
                    details: "",
                    type: "",
                });
                setSpinner(false);
            }
            setSubmitted(false);
        } else {
            setSpinner(false);
            toast.current.show({
                severity: "error",
                summary: "خطا",
                detail: "لطفآ تمام معلومات را درست خانه پوری نمایدن.",
            });
        }
    };

    // update single customer
    const setTransactionValue = (e) => {
        setWidthdraw({ ...widthdraw, [e.target.name]: e.target.value });
    };
    return (
        <div className="grid">
            <div className="col-12 md:col-8" dir="rtl">
                <Card className="card p-fluid" title="برداشت جدید">
                    <div className="p-fluid grid">
                        <div className="field col-12 md:col-6" dir="ltr">
                            <span className="p-float-label">
                                <Dropdown value={widthdraw.holder} optionValue="_id" options={allHolders} optionLabel="name" onChange={setTransactionValue} name="holder" id="holder" filter required className={classNames({ "p-invalid": submitted && !widthdraw.holder })} />
                                <label htmlFor="kind">شریک یا کارمند</label>
                                {submitted && !widthdraw.holder && <small className="p-error">اسم شریک ضروری است</small>}
                            </span>
                        </div>
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar value={widthdraw.date} onChange={setTransactionValue} name="date" id="date" required className={classNames({ "p-invalid": submitted && !widthdraw.date })}></Calendar>
                                <label htmlFor="date">تاریخ</label>
                                {submitted && !widthdraw.amount && <small className="p-error">تاریخ ضروری است</small>}
                            </span>
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputNumber value={widthdraw.amount} onValueChange={setTransactionValue} mode="decimal" name="amount" id="amount" required className={classNames({ "p-invalid": submitted && !widthdraw.amount })} />
                                <label htmlFor="amount">مقدار پول</label>
                                {submitted && !widthdraw.amount && <small className="p-error">مقدار پول ضروری است</small>}
                            </span>
                        </div>

                        <div className="field col-12 md:col-6">
                            <span className="p-float-label" dir="ltr">
                                <Dropdown value={widthdraw.type} optionValue="name" options={[{ name: "دالر" }, { name: "افغانی" }]} optionLabel="name" onChange={setTransactionValue} name="type" id="type" filter required className={classNames({ "p-invalid": submitted && !widthdraw.type })} />
                                <label htmlFor="type">نوعیت پول</label>
                                {submitted && !widthdraw.type && <small className="p-error">نوعیت پول ضروری است</small>}
                            </span>
                        </div>

                        <div className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputTextarea cols={30} value={widthdraw.details} onChange={setTransactionValue} name="details" id="details" required className={classNames({ "p-invalid": submitted && !widthdraw.details })} />
                                <label htmlFor="details">تفصیلات</label>
                                {submitted && !widthdraw.details && <small className="p-error">تفصیلات ضروری است</small>}
                            </span>
                        </div>
                        <Button label="ثبت برداشت" loading={Spinner} onClick={saveTransaction} />
                    </div>
                </Card>
            </div>
            <Toast ref={toast} position="bottom-left" dir="ltr" className="text-right" />
        </div>
    );
}

export default AddWithdraw;
