import React, { useState } from "react";
import expenseContext from "./withdrawContext";
import { WITHDRAWS_URL } from "../../../DBconfig";
const ExpenseState = (props) => {
    let login = { success: false };
    let toekn = "";
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
        toekn = login.authToken;
    }

    // host/backend server url
    const host = WITHDRAWS_URL;

    const holderState = [];

    const [allwithdraws, setallwithdraws] = useState(holderState);

    // Get all expenses
    const getWithdraws = async () => {
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
        setallwithdraws(json);
    };

    // Add Customername
    const addWithdraw = async (holder, date, amount, type, details) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                holder: holder,
                date: date,
                amount: amount,
                type: type,
                details: details,
            }),
        });
        // if no error fecth the data
        const newholder = await response.json();
        if (!("errors" in newholder)) {
            // update the all customers list
            setallwithdraws(allwithdraws.concat(newholder));
        }
        return newholder;
    };

    return <expenseContext.Provider value={{ allwithdraws, getWithdraws, addWithdraw }}>{props.children}</expenseContext.Provider>;
};

export default ExpenseState;
