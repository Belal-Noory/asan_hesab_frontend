import React, { useState, useRef, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import * as XLSX from "xlsx";
import customerContext from "../../context/bussiness/customers/customerContext";

function AddStaff() {
    // bussiness data global context
    const customerData = useContext(customerContext);
    // get just add customer context
    const { addStaff } = customerData;

    const [singleCustomer, setsingleCustomer] = useState({ name: "", phone: "" });
    // show spinner
    const [Spinner, setSpinner] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formError, setformError] = useState(false);
    const toast = useRef(null);

    // onchange of inputs
    const FillCustomer = (e) => {
        setsingleCustomer({ ...singleCustomer, [e.target.name]: e.target.value });
    };

    // Upload handler
    const onUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = new Uint8Array(evt.target.result);
                const wb = XLSX.read(bstr, { type: "array" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                data.some((el) => {
                    if (el.hasOwnProperty("name") || el.hasOwnProperty("phone")) {
                        data.forEach(async (element) => {
                            setUploading(true);
                            let res = await addStaff(element.name, element.phone);
                            if (res) {
                                toast.current.show({
                                    severity: "success",
                                    summary: "موفقانه اجرا شد",
                                    detail: "کارمند موفقانه در سیستم ثبت شدند",
                                });
                                setUploading(false);
                            }
                        });
                        return true;
                    } else {
                        return false;
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
        }
    };

    // function to add/save customer
    const saveCustomer = (e) => {
        e.preventDefault();
        if (singleCustomer.name.length > 3) {
            setSpinner(true);
            setformError(false);
            addStaff(singleCustomer.name, singleCustomer.phone);
            toast.current.show({ severity: "success", summary: "موفق", detail: "کارمند موفقانه درج سیستم شد.", life: 3000 });
            setSpinner(false);
            setsingleCustomer({ name: "", phone: "" });
        } else {
            toast.current.show({ severity: "error", summary: "توجه", detail: "لطفآ تمام مشخصات را نوشته کنید.", life: 3000 });
            setSpinner(false);
            setformError(true);
        }
    };

    // clear form
    const clearForm = () => {
        singleCustomer.name = "";
        singleCustomer.phone = "";
        setformError(true);
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-6 text-right">
                <div className="card bg-primary">
                    <h5>ثبت مشتریان از طریق فایل Excel</h5>
                    <p>مشتری محترم حالا شما میتوانید تمام کارمندان شرکت خود را در یک فایل اکسل ذخره کرده و به سیستم ما اپلود کونید. </p>

                    <div className="field text-center">
                        <label htmlFor="file" className={uploading ? "pi pi-spin pi-spinner" : "pi pi-fw pi-cloud-upload"} id="uploadlabel"></label>
                        <input className="hidden" type="file" name="file" id="file" onChange={onUpload} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" disabled={uploading} />
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6" dir="rtl">
                <div className="card p-fluid">
                    <h5 className="mx-3">ثبت کارمند از طریق فورم</h5>
                    <p>مشری محترم شما میتوانید کارمندان خود را یا از طریق فورم ذیل در سیستم ثبت کنید و یا هم لیست از کارمندان تانرا در یک فایل excel ذخیزه کرده و به سیستم اپلود کنید.</p>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText type="text" name="name" id="name" value={singleCustomer.name} onChange={FillCustomer} className={formError ? "form-control p-invalid" : "form-control"} />
                            <label htmlFor="name">اسم کارمند</label>
                        </span>
                    </div>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText type="text" id="phone" name="phone" value={singleCustomer.phone} onChange={FillCustomer} className={formError ? "form-control p-invalid" : "form-control"} />
                            <label htmlFor="phone">شماره تلفون</label>
                        </span>
                    </div>
                    <div className="flex col-6">
                        <Button label="ثبت مشتری" icon={Spinner ? "pi pi-spin pi-spinner" : "pi pi-check"} className="mx-1" onClick={saveCustomer} disabled={Spinner} />
                        <Button label="لغوه" icon="pi pi-times" className="mx-1" onClick={clearForm} />
                    </div>
                </div>
            </div>
            <Toast ref={toast} position="top-right" dir="ltr" className="text-right" />
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(AddStaff, comparisonFn);
