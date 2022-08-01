import React, { useState } from "react";
import loginContext from "./loginContext";
import { LOGIN_URL } from "../../../DBconfig";
const ExpenseState = (props) => {
    // host/backend server url
    const host = LOGIN_URL;
    const [login, setlogin] = useState({ success: false, authToken: "", error: "" });

    // Get all expenses
    const getLogin = async (email, password) => {
        // call API to login
        const login = await fetch(`${host}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const json = await login.json();
        return json;
    };

    // Undo Delete Transaction
    const logout = async (id) => {
        // call API to update the customer in the database
        setlogin({ success: false, authToken: "" });
    };

    return <loginContext.Provider value={{ getLogin, login, logout, setlogin }}>{props.children}</loginContext.Provider>;
};

export default ExpenseState;
