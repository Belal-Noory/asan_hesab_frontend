import React, { useState, useContext, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import shareholderContext from "../../context/bussiness/shareholders/shareholderContext";

function AddShareholder() {
    // bussiness data global context
    const holderData = useContext(shareholderContext);
    // get just add customer context
    const { addHolder } = holderData;

    const [singleHolder, setsingleHolder] = useState({ name: "", capital: 0 });
    // show spinner
    const [Spinner, setSpinner] = useState(false);
    const toast = useRef(null);

    // clear form
    const clearForm = () => {
        singleHolder.name = "";
        singleHolder.capital = "";
    };

    // onchange of inputs
    const setHolder = (e) => {
        setsingleHolder({ ...singleHolder, [e.target.name]: e.target.value });
    };

    // function to add/save customer
    const saveShareHolder = (e) => {
        e.preventDefault();
        if (singleHolder.name.length > 3) {
            setSpinner(true);
            addHolder(singleHolder.name, singleHolder.capital);
            toast.current.show({ severity: "success", summary: "موفق", detail: "شریک موفقانه درج سیستم شد.", life: 3000 });
            setSpinner(false);
            setsingleHolder({ name: "", capital: "" });
        } else {
            toast.current.show({ severity: "error", summary: "توجه", detail: "لطفآ تمام مشخصات را نوشته کنید.", life: 3000 });
            setSpinner(false);
        }
    };

    return (
        <>
            <div className="col-12 md:col-8" dir="rtl">
                <div className="card p-fluid">
                    <h5 className="mx-3">ثبت شریکان از طریق فورم</h5>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText type="text" name="name" id="name" value={singleHolder.name} onChange={setHolder} className="form-control" />
                            <label htmlFor="name">اسم شریک</label>
                        </span>
                    </div>
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText type="text" id="capital" name="capital" value={singleHolder.capital} onChange={setHolder} className="form-control" />
                            <label htmlFor="capital">سهم شریک</label>
                        </span>
                    </div>
                    <div className="flex col-6">
                        <Button label="ثبت شریک" icon={Spinner ? "pi pi-spin pi-spinner" : "pi pi-check"} className="mx-1" onClick={saveShareHolder} disabled={Spinner} />
                        <Button label="لغوه" icon="pi pi-times" className="mx-1" onClick={clearForm} />
                    </div>
                </div>
            </div>
            <Toast ref={toast} position="top-right" dir="ltr" className="text-right" />
        </>
    );
}

export default AddShareholder;
