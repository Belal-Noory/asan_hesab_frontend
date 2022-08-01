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
    const editExpense = async (id, customer, date, details, amount, type, kind, status) => {
        // call API to update the customer in the database
        await fetch(`${host}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                customer: customer,
                details: details,
                amount: amount,
                type: type,
                date: date,
                kind: kind,
                status: status,
            }),
        });
        // find the customer that needs to be updated from customers list
        let updateCustomer = allExpense.filter((customer) => {
            return customer._id === id;
        });

        // update the filtered customer
        updateCustomer._id = id;
        updateCustomer.customer = customer;
        updateCustomer.details = details;
        updateCustomer.amount = amount;
        updateCustomer.type = type;
        updateCustomer.date = date;
        updateCustomer.kind = kind;
        updateCustomer.status = status;
        // get all customers except the updated one
        const newCustomerList = allExpense.filter((customer) => {
            return customer._id !== id;
        });

        // bind tow list and set it as customer list
        const updatedCustomerList = newCustomerList.concat(updateCustomer);

        // update customer status
        setallExpense(updatedCustomerList);
    };

    return <expenseContext.Provider value={{ allExpense, getExpenses, getDeletedExpenses, addExpense, deleteExpense, undoDeletedExpense, editExpense }}>{props.children}</expenseContext.Provider>;
};

export default ExpenseState;
