import React, { useState, useEffect, useContext } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import randomColor from "randomcolor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import "./Dashboard.css";
import transactionContext from "../context/bussiness/transaction/transactionContext";
import withdrawContext from "../context/bussiness/withdraw/withdrawContext";
import customerContext from "../context/bussiness/customers/customerContext";
import LoadingScreen from "react-loading-screen";

const Dashboard = () => {
    // Transactions
    const transactionData = useContext(transactionContext);
    const { allTransactions, getTransactions } = transactionData;

    // Withdraw
    const withdrawData = useContext(withdrawContext);
    const { allwithdraws, getWithdraws } = withdrawData;

    // Customers
    const customerData = useContext(customerContext);
    const { allCustomers, getCustomers } = customerData;
    const [loader, setloader] = useState(true);
    const [debets, setDebets] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            },
        ],
    });

    const [credits, setCredits] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                hoverBackgroundColor: [],
            },
        ],
    });

    // total withdraws
    const [totalWithdraw, settotalWithdraw] = useState(0);
    // total Talabat and Baqyat
    const [totalDebets, setTotalDebets] = useState(0);
    const [totalCredits, setTotalCredits] = useState(0);
    // List customers in the dashboard
    const [expandedRows, setExpandedRows] = useState([]);

    // load all transactions
    useEffect(() => {
        const getData = async () => {
            await getTransactions();
            await getWithdraws();
            await getCustomers();
            setloader(false);
        };
        getData();
    }, []);

    useEffect(() => {
        // Get all fuel types
        let f_typesDebet = [];
        let f_typesCredit = [];
        let f_type_amountDebets = [];
        let colorsDebets = [];
        let f_type_amountCredits = [];
        let colorsCredits = [];
        allTransactions.forEach((element) => {
            if (element.t_type === "???????? ????????") {
                if (f_typesDebet.indexOf(element.fuel_type) === -1) {
                    f_typesDebet.push(element.fuel_type);
                }
            } else {
                if (f_typesCredit.indexOf(element.fuel_type) === -1) {
                    f_typesCredit.push(element.fuel_type);
                }
            }
        });

        // get total amount of uniques fuel types and amount type = credit
        f_typesCredit.forEach((type) => {
            let total = 0;
            allTransactions
                .filter((tran) => tran.fuel_type === type && tran.t_type === "?????? ????????")
                .forEach((filterd) => {
                    total += filterd.unit_price * filterd.tone_quantity;
                });
            colorsCredits.push(
                randomColor({
                    luminosity: "dark",
                    format: "rgba",
                    alpha: 0.5,
                })
            );
            f_type_amountCredits.push(total);
        });

        // get total amount of uniques fuel types and amount type = debets
        f_typesDebet.forEach((type) => {
            let total = 0;
            allTransactions
                .filter((tran) => tran.fuel_type === type && tran.t_type === "???????? ????????")
                .forEach((filterd) => {
                    total += filterd.unit_price * filterd.tone_quantity;
                });
            colorsDebets.push(
                randomColor({
                    luminosity: "random",
                    format: "rgba",
                    alpha: 0.5,
                })
            );
            f_type_amountDebets.push(total);
        });

        // set all credits
        setCredits((prev) => {
            let lbl = prev.labels;
            lbl = f_typesCredit;
            let data = prev.datasets.slice();
            data[0].data = f_type_amountCredits;
            data[0].backgroundColor = colorsCredits;
            data[0].hoverBackgroundColor = colorsCredits;
            return { labels: lbl, datasets: data };
        });

        // set all Debets
        setDebets((prev) => {
            let lbl = prev.labels;
            lbl = f_typesDebet;
            let data = prev.datasets.slice();
            data[0].data = f_type_amountDebets;
            data[0].backgroundColor = colorsDebets;
            data[0].hoverBackgroundColor = colorsDebets;
            return { labels: lbl, datasets: data };
        });

        // get total debets and credits
        let debets = 0;
        let credits = 0;
        allTransactions.forEach((element) => {
            if(("unit_price" in element))
            {
                if (element.t_type === "???????? ????????") {
                    debets += element.unit_price * element.tone_quantity;
                } else {
                    credits += element.unit_price * element.tone_quantity;
                }
            }
        });
        setTotalCredits(credits);
        setTotalDebets(debets);

        // calculate total withdraw
        let total = 0;
        allwithdraws.forEach((wid) => {
            total += parseInt(wid.amount);
        });
        settotalWithdraw(total);
    }, [allTransactions]);

    const headerTemplate = (data) => {
        return (
            <>
                <span className="image-text text-right">{data.customer.name}</span>
            </>
        );
    };

    const calculateCustomerTotal = (id, type) => {
        let total = 0;
        allTransactions
            .filter((tran) => tran.customer._id === id && tran.t_type === type)
            .forEach((filterd) => {
                total += filterd.unit_price * filterd.tone_quantity;
            });
        return total;
    };

    const calculateCustomerTotalReceive = (id, type) => {
        let total = 0;
        allTransactions.forEach((filter1) => {
            if (!("tone_quantity" in filter1)) {
                if(filter1.type === type && filter1.customer._id === id)
                {
                    total += filter1.amount;
                }
            }
        });
        return total;
    };

    const calculatTotal = (rowData) => {
        if (("tone_quantity" in rowData)) {
            return rowData.unit_price * rowData.tone_quantity;
        }
        else {
            return rowData.amount;
        }
    };

    const formatDate = (rowData) => {
        return moment(Date(rowData.date)).format("d/m/Y");
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="2" style={{ textAlign: "right", backgroundColor: "lightgray" }}>
                    ???????????? ??????????
                </td>
                <td style={{ backgroundColor: "lightgray" }}>{calculateCustomerTotal(data.customer._id, "?????? ????????")}</td>
                <td colSpan="2" style={{ textAlign: "right", backgroundColor: "lightgray" }}>
                    ???????????? ????????????
                </td>
                <td style={{ backgroundColor: "lightgray" }}>{calculateCustomerTotal(data.customer._id, "???????? ????????")}</td>
                <td colSpan="2" style={{ textAlign: "right", backgroundColor: "lightgray" }}>
                    ???????? ??????????
                </td>
                <td style={{ backgroundColor: "lightgray" }}>{calculateCustomerTotalReceive(data.customer._id, "????????")}</td>
                <td colSpan="2" style={{ textAlign: "right", backgroundColor: "lightgray" }}>
                    ???????? ????????????
                </td>
                <td style={{ backgroundColor: "lightgray" }}>{calculateCustomerTotalReceive(data.customer._id, "????????????")}</td>
            </React.Fragment>
        );
    };

    return (
        <LoadingScreen loading={loader} bgColor="#f1f1f1" spinnerColor="tomato" textColor="#676767" logoSrc="/images/logo-dark.svg" text="???? ?????? ??????????????">
            <React.Fragment>
                <div className="grid">
                    <div className="surface-0 text-700 text-center col-12 p-5 mb-4" dir="rtl" style={{ borderRadius: "1rem", background: "linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)" }}>
                        <div className="text-900 font-bold text-5xl mb-3 text-white">?????? ?????????? ???? ?????????? ???????? ????????</div>
                        <div className="text-700 text-2xl mb-5 text-white">?????????? ?????????? ???????? ???? ???? ???????? ?????? ???????????? ???????????? ???????? ?????????? ???????? ?????????? ?????? ???????? ?????????????? ???? ???????? ?????? ???????? ?? ?????? ???????? ???? ?????? ?????? ???????? ????????.</div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0" dir="rtl">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">???????????? ??????????</span>
                                    <div className="text-900 font-medium text-xl">
                                        {totalCredits}
                                        <i className="pi pi-dollar text-blue-500 text-xl" />
                                    </div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-dollar text-blue-500 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0" dir="rtl">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">???????????? ????????????</span>
                                    <div className="text-900 font-medium text-xl">
                                        {totalDebets}
                                        <i className="pi pi-dollar text-blue-500 text-xl" />
                                    </div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-dollar text-blue-500 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0" dir="rtl">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">???????????? ??????????</span>
                                    <div className="text-900 font-medium text-xl">{totalWithdraw}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-dollar text-blue-500 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0" dir="rtl">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">???????????? ??????????????</span>
                                    <div className="text-900 font-medium text-xl">{allCustomers.length}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-users text-blue-500 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid mt-2 mb-2 col-12">
                    <div className="datatable-rowgroup-demo col-12">
                        <div className="card col-12" dir="rtl">
                            <h5>???????? ?????????? ?????????????? ????????</h5>
                            <p>???? ?????? ???????? ?????? ?????? ???????????? ???? ?????? ???? ???????????? ?????? ???? ???????? ???????? ????????????????.</p>
                            <DataTable
                                value={allTransactions}
                                rowGroupMode="subheader"
                                groupRowsBy="customer.name"
                                sortMode="single"
                                sortField="customer.name"
                                sortOrder={1}
                                responsiveLayout="scroll"
                                expandableRowGroups
                                expandedRows={expandedRows}
                                onRowToggle={(e) => setExpandedRows(e.data)}
                                rowGroupHeaderTemplate={headerTemplate}
                                rowGroupFooterTemplate={footerTemplate}
                            >
                                <Column field="customer.name" header="?????? ??????????"></Column>
                                <Column field="date" header="??????????" body={formatDate}></Column>
                                <Column field="details" header="??????????????"></Column>
                                <Column field="drive" header="????????????"></Column>
                                <Column field="palit" header="???????? ????????"></Column>
                                <Column field="page" header="????????"></Column>
                                <Column field="tone_quantity" header="?????????? ??????"></Column>
                                <Column field="fuel_type" header="??????????"></Column>
                                <Column field="unit_price" header="???? ????"></Column>
                                <Column field="Total" header="????????????" body={calculatTotal}></Column>
                                <Column field="t_type" header="??????"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

                <div className="grid mt-2">
                    {credits.length > 0 ? (
                        <div className="col-12 lg:col-6 text-center">
                            <Card title="???????????? ?????????? ???? ???????? ?????????? ????????" className="flex justify-content-center">
                                <Chart type="pie" data={credits} />
                            </Card>
                        </div>
                    ) : (
                        ""
                    )}

                    {debets.length > 0 ? (
                        <div className="col-12 lg:col-6">
                            <Card title="???????????? ???????????? ???? ???????? ?????????? ????????" className="flex justify-content-center">
                                <Chart type="pie" data={debets} />
                            </Card>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </React.Fragment>
        </LoadingScreen>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
