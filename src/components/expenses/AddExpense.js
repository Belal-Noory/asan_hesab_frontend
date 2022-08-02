import React, { useState, useContext, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import expenseContext from "../../context/bussiness/expense/expenseContext";

function AddExpense() {
    // bussiness data global context
    const expenseData = useContext(expenseContext);

    // get just add customer context
    const { addExpense } = expenseData;
    const toast = useRef(null);

    // Create state for a single customer to add
    const [transaction, setTransaction] = useState({
        date: "",
        details: "",
        amount: 0,
        kind: "",
    });

    const [Spinner, setSpinner] = useState(false);

    // function to add/save customer
    const saveTransaction = async (e) => {
        if (!Object.values(transaction).every((x) => x === null || x === "" || x === 0)) {
            setSpinner(true);
            let cas = await addExpense(transaction.date, transaction.details, transaction.amount, transaction.kind);

            if (!("errors" in cas)) {
                toast.current.show({
                    severity: "success",
                    summary: "درج معامله",
                    detail: "مصارف شما موفقانه درج سیستم شد",
                });
                transaction.date = "";
                transaction.amount = "";
                transaction.details = "";
                transaction.kind = "";
                setSpinner(false);
            } else {
                const erros = cas.errors;
                const result = Array();
                for (let i = 0; i < erros.length; i++) {
                    let textbox = "";
                    switch (erros[i].param) {
                        case "details":
                            textbox = "تفصیلات";
                            break;
                        case "amount":
                            textbox = "مقدار پول";
                            break;
                        case "type":
                            textbox = "نوعیت پول";
                            break;
                        case "date":
                            textbox = "تاریخ مصارف";
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

    // update single customer
    const setTransactionValue = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-8" dir="rtl">
                <Card className="card p-fluid" title="مصرف جدید">
                    <div className="p-fluid grid">
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Calendar value={transaction.date} onChange={setTransactionValue} name="date" id="date" required></Calendar>
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
                        <Button label="ثبت مصرف" loading={Spinner} onClick={saveTransaction} />
                    </div>
                </Card>
            </div>
            <Toast ref={toast} position="bottom-left" dir="ltr" className="text-right" />
        </div>
    );
}

export default AddExpense;
