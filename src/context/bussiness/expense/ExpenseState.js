import React, { useState } from "react";
import expenseContext from "./expenseContext";
import { EXPENSES_URL } from "../../../DBconfig";
const ExpenseState = (props) => {
    // host/backend server url
    const host = EXPENSES_URL;
    let login = { success: false };
    let toekn = "";
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
        toekn = login.authToken;
    }
    const expenseState = [];

    const [allExpense, setallExpense] = useState(expenseState);

    // Get all expenses
    const getExpenses = async () => {
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
        setallExpense(json);
    };

    // Get all deleted Expenses
    const getDeletedExpenses = async () => {
        // call API to add the customer to the database
        const transaction = await fetch(`${host}/deleted`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });
        const json = await transaction.json();
        // update the all customers list
        setallExpense(json);
    };

    // Add Customer
    const addExpense = async (date, details, amount, kind) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                date: date,
                amount: amount,
                details: details,
                kind: kind,
            }),
        });
        // if no error fecth the data
        const newTransaction = await response.json();
        if (!("errors" in newTransaction)) {
            // update the all customers list
            setallExpense(allExpense.concat(newTransaction));
        }
        return newTransaction;
    };

    // Delete Customer
    const deleteExpense = async (id) => {
        // call API to add the customer to the database
        await fetch(`${host}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        // return all customers except the deleted one
        const newCustomer = allExpense.filter((customer) => {
            return customer._id !== id;
        });
        // update all customers list
        setallExpense(newCustomer);
    };

    // Undo Delete Transaction
    const undoDeletedExpense = async (id) => {
        // call API to update the customer in the database
        await fetch(`${host}/undelete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });
    };

    // Edit Customer
    const editExpense = async (id, user, date, details, amount, kind) => {
        // call API to update the customer in the database
        const res = await fetch(`${host}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                user: user,
                details: details,
                amount: amount,
                date: date,
                kind: kind,
            }),
        });
        getExpenses();
    };

    return <expenseContext.Provider value={{ allExpense, getExpenses, getDeletedExpenses, addExpense, deleteExpense, undoDeletedExpense, editExpense }}>{props.children}</expenseContext.Provider>;
};

export default ExpenseState;
