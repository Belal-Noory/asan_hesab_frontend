import React, { useState, useContext, useEffect, useRef } from "react";
import transactionContext from "../../context/bussiness/transaction/transactionContext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import Moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import LoadingScreen from "react-loading-screen";

function DeletedTransactions() {
    const transactionData = useContext(transactionContext);
    const { allTransactions, undoDeletedTransaction, getDeletedTransactions } = transactionData;

    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState("");
    const [loading1, setLoading1] = useState(true);
    const dt = useRef(null);
    const toast = useRef(null);
    const [loader, setloader] = useState(true);

    // call customer context to run get all customers function to fetch customers from database
    useEffect(() => {
        const getAllData = async () => {
            await getDeletedTransactions();
            setloader(false);
        };
        getAllData();
        setLoading1(false);
    }, [undoDeletedTransaction]);

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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-undo" className="p-button-rounded p-button-primary" onClick={() => undoDeletedTransaction(rowData._id)} />
            </React.Fragment>
        );
    };

    const header1 = renderHeader1();

    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="در حال بارگیری">
            <div className="grid">
                <div className="datatable-filter-demo col-12">
                    <div className="card p-fluid" dir="rtl">
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
                            <Column field="fuel_type" header="نوعیت مایع" filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column field="tone_quantity" header="مقدار تون" className="text-right" />
                            <Column field="unit_price" header="فی تون" className="text-right" />
                            <Column field="t_type" header="نوعیت پول" filter filterPlaceholder="جستجوی" className="text-right" />
                            <Column header="مجموعآ پول" body={calculatTotalAmount} className="text-right" />
                            <Column body={actionBodyTemplate} exportable={false}></Column>
                        </DataTable>
                    </div>
                    <Toast ref={toast} />
                </div>
            </div>
        </LoadingScreen>
    );
}

export default DeletedTransactions;
