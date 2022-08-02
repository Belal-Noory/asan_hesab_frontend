import React, { useContext, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import shareholderContext from "../../context/bussiness/shareholders/shareholderContext";
import TableExports from "../TableExports";
import LoadingScreen from "react-loading-screen";

function Shareholders() {
    let emptyHolder = {
        id: null,
        name: "",
        capital: 0,
    };

    const shareholderData = useContext(shareholderContext);
    const { allHolders, getHolders, addHolder } = shareholderData;
    const [loader, setloader] = useState(true);
    const [productDialog, setCustomerDialog] = useState(false);
    const [customer, setCustomer] = useState(emptyHolder);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        const getData = async () => {
            await getHolders();
            setloader(false);
        };
        getData();
    }, []);

    const openNew = () => {
        setCustomer(emptyHolder);
        setSubmitted(false);
        setCustomerDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCustomerDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (!Object.values(customer).every((x) => x === null || x === "" || x === 0)) {
            setSubmitted(true);
            addHolder(customer.name, customer.capital);
            toast.current.show({ severity: "success", summary: "توجه", detail: "شریک موفقانه اضعافه شد", life: 3000 });
            setCustomerDialog(false);
            setCustomer(emptyHolder);
        } else {
            toast.current.show({ severity: "error", summary: "توجه", detail: "لطفآ فورم را بشکل مکمل خانه پوری نمایند.", life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...customer };
        _product[`${name}`] = val;
        setCustomer(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="شریک جدید" icon="pi pi-plus" className="p-button-success mr-2 header" onClick={openNew} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <TableExports
                cols={[
                    { field: "name", header: "Name" },
                    { field: "capital", header: "Capital" },
                ]}
                data={allHolders}
                dt={dt}
                title="شریکان"
            />
        );
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="لغوه" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="ثبت" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );

    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="datatable-crud-demo" dir="rtl">
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <Tooltip target=".export-buttons>button" position="bottom" />
                    <DataTable
                        ref={dt}
                        value={allHolders}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="از {first} تا {last} مجموعه {totalRecords} شریکان"
                        responsiveLayout="scroll"
                        className="text-right"
                        size="small"
                        scrollHeight="460px"
                        filterDisplay="menu"
                        loading={loader}
                    >
                        <Column field="name" header="شریک" sortable className="text-right" filter filterPlaceholder="جستجو"></Column>
                        <Column field="capital" header="سهم" sortable className="text-right"></Column>
                    </DataTable>
                </div>

                <Dialog visible={productDialog} style={{ width: "450px" }} header="مشخصات شریک" modal className="p-fluid text-right" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name">اسم شریک</label>
                        <InputText id="name" name="name" value={customer.name} onChange={(e) => onInputChange(e, "name")} required className={classNames({ "p-invalid": submitted && !customer.name })} dir="rtl" placeholder="اسم شریک" />
                        {submitted && !customer.name && <small className="p-error">اسم شریک ضروری است</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="phone">سهم</label>
                        <InputText id="phone" name="phone" value={customer.phone} onChange={(e) => onInputChange(e, "capital")} required className={classNames({ "p-invalid": submitted && !customer.capital })} dir="rtl" placeholder="سهم" />
                        {submitted && !customer.capital && <small className="p-error">سهم شریک ضروری است</small>}
                    </div>
                </Dialog>
            </div>
        </LoadingScreen>
    );
}

export default Shareholders;
