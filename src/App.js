import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useLocation, Redirect, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";

import Dashboard from "./components/Dashboard";
import Customers from "./components/customers/Customers";
import AddCustomer from "./components/customers/AddCustomer";
import Transactions from "./components/transactions/Transactions";
import AddTransaction from "./components/transactions/AddTransaction";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";
import "./App.css";

import CustomerState from "./context/bussiness/customers/CustomerState";
import TransactionState from "./context/bussiness/transaction/TransactionState";
import ExpenseState from "./context/bussiness/expense/ExpenseState";
import ShareholderState from "./context/bussiness/shareholders/ShareholderState";
import WithdrawState from "./context/bussiness/withdraw/WithdrawState";
import DeletedCustomers from "./components/customers/DeletedCustomers";
import DeletedTransactions from "./components/transactions/DeletedTransactions";
import AddExpense from "./components/expenses/AddExpense";
import AddStaff from "./components/staffs/AddStaff";
import Staffs from "./components/staffs/Staffs";
import DeletedStaffs from "./components/staffs/DeletedStaffs";
import Expenses from "./components/expenses/Expenses";
import DeletedExpenses from "./components/expenses/DeletedExpenses";
import AddWithdraw from "./components/widthdraw/AddWithdraw";
import Withdraw from "./components/widthdraw/Withdraws";
import AddShareholder from "./components/shareholder/AddShareholder";
import Shareholders from "./components/shareholder/Shareholders";
import Login from "./components/login/Login";

const App = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const history = useHistory();
    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;
        event.preventDefault();
        if(event.currentTarget.id === "logout"){
            localStorage.removeItem("login");
            history.push("/login");
        }
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const menu = [
        {
            label: "صفحه عمومی",
            items: [
                {
                    label: "صفحه عمومی",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
            ],
        },
        {
            label: "شریکان شرکت",
            icon: "pi pi-fw pi-sitemap",
            items: [
                { label: "شریک جدید", icon: "pi pi-fw pi-plus", to: "/shareholder/new" },
                { label: "لیست شریکان", icon: "pi pi-fw pi-users", to: "/shareholders" },
            ],
        },
        {
            label: "مشتریان شرکت",
            icon: "pi pi-fw pi-sitemap",
            items: [
                { label: "مشتری جدید", icon: "pi pi-fw pi-plus", to: "/customers/new" },
                { label: "لیست مشتریان", icon: "pi pi-fw pi-users", to: "/customers" },
                { label: "لیست مشتریان حذف شده", icon: "pi pi-fw pi-trash", to: "/customers/deleted" },
            ],
        },
        {
            label: "حسابات",
            items: [
                { label: "حساب جدید", icon: "pi pi-fw pi-plus", to: "/transactions/new" },
                { label: "لیست حسابات", icon: "pi pi-fw pi-chart-bar", to: "/transactions" },
                { label: "لیست حساب های حذف شده", icon: "pi pi-fw pi-trash", to: "/transactions/deleted" },
            ],
        },
        {
            label: "کارمندان",
            items: [
                { label: "کارمند جدید", icon: "pi pi-fw pi-user-plus", to: "/staff/new" },
                { label: "لیست کارمندان", icon: "pi pi-fw pi-users", to: "/staffs" },
                { label: "لیست کارمندان حذف شده", icon: "pi pi-fw pi-user-minus", to: "/staffs/deleted" },
            ],
        },
        {
            label: "مصارفات",
            items: [
                { label: "مصرف جدید", icon: "pi pi-fw pi-plus", to: "/expense/new" },
                { label: "لیست مصارفات", icon: "pi pi-fw pi-chart-bar", to: "/expenses" },
                { label: "لیست مصارفات حذف شده", icon: "pi pi-fw pi-trash", to: "/expenses/deleted" },
            ],
        },
        {
            label: "برداشت",
            items: [
                { label: "برداشت جدید", icon: "pi pi-fw pi-plus", to: "/withdraw/new" },
                { label: "لیست برداشت", icon: "pi pi-fw pi-chart-bar", to: "/withdraws" },
            ],
        },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    let login = {success:false};
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
    }

    function PrivateRoute ({component: Component, authed, ...rest}) {
        return (
          <Route
            {...rest}
            render={(props) => authed === true
              ? <Component {...props} />
              : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
          />
        )
      }

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar hide={!login.success?"hide":""} onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className={!login.success?"hide":"layout-sidebar"} onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>
            <TransactionState>
                <CustomerState>
                    <ExpenseState>
                        <ShareholderState>
                            <WithdrawState>
                                <div className="layout-main-container">
                                    <div className="layout-main">
                                            <PrivateRoute  path="/" exact authed={login.success} component={Dashboard} />
                                            {/* Customer */}
                                            <PrivateRoute  path="/customers" authed={login.success} exact component={Customers} />
                                            <PrivateRoute  path="/customers/new" authed={login.success} exact component={AddCustomer} />
                                            <Route path="/customers/deleted" authed={login.success} exact component={DeletedCustomers} />
                                            {/* Shareholders */}
                                            <PrivateRoute  path="/shareholders" authed={login.success} exact component={Shareholders} />
                                            <PrivateRoute  path="/shareholder/new" authed={login.success} exact component={AddShareholder} />
                                            {/* Transactions */}
                                            <PrivateRoute  path="/transactions" authed={login.success} exact component={Transactions} />
                                            <PrivateRoute  path="/transactions/new" authed={login.success} exact component={AddTransaction} />
                                            <PrivateRoute  path="/transactions/deleted" authed={login.success} exact component={DeletedTransactions} />
                                            {/* Staff */}
                                            <PrivateRoute  path="/staff/new" authed={login.success} exact component={AddStaff} />
                                            <Route path="/staffs" authed={login.success} exact component={Staffs} />
                                            <PrivateRoute  path="/staffs/deleted" authed={login.success} exact component={DeletedStaffs} />
                                            {/* Expense */}
                                            <PrivateRoute  path="/expense/new" authed={login.success} exact component={AddExpense} />
                                            <PrivateRoute path="/expenses" authed={login.success} exact component={Expenses} />
                                            <PrivateRoute  path="/expenses/deleted" authed={login.success} exact component={DeletedExpenses} />
                                            {/* withdraw */}
                                            <PrivateRoute  path="/withdraw/new" authed={login.success} exact component={AddWithdraw} />
                                            <PrivateRoute  path="/withdraws" authed={login.success} exact component={Withdraw} />
                                            {/* login */}
                                            <Route path="/login" exact component={Login} />
                                    </div>
                                    <AppFooter hide={!login.success ? "hide" : ""} layoutColorMode={layoutColorMode} />
                                </div>
                            </WithdrawState>
                        </ShareholderState>
                    </ExpenseState>
                </CustomerState>
            </TransactionState>
            {!login.success?"":<AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />}
            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default App;
