import React, { useState } from "react";
import expenseContext from "./shareholderContext";
import { HOLDERS_URL } from "../../../DBconfig";
const ExpenseState = (props) => {
    // host/backend server url
    const host = HOLDERS_URL;
    let login = { success: false };
    let toekn = "";
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
        toekn = login.authToken;
    }

    const holderState = [];

    const [allHolders, setallHolders] = useState(holderState);

    // Get all expenses
    const getHolders = async () => {
        // call API to add the customer to the database
        const transaction = await fetch(`${host}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await transaction.json();
        // update the all customers list
        setallHolders(json);
    };

    // Add Customer
    const addHolder = async (name, capital) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                name: name,
                capital: capital,
            }),
        });
        // if no error fecth the data
        const newholder = await response.json();
        if (!("errors" in newholder)) {
            // update the all customers list
            setallHolders(allHolders.concat(newholder));
        }
        return newholder;
    };

    return <expenseContext.Provider value={{ allHolders, getHolders, addHolder }}>{props.children}</expenseContext.Provider>;
};

export default ExpenseState;
