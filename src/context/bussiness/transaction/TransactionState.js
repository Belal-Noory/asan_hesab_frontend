import React, { useState } from "react";
import transactionContext from "./transactionContext";
import { TRANSACTIONS_URL } from "../../../DBconfig";
const TransactionState = (props) => {
    // host/backend server url
    const host = TRANSACTIONS_URL;
    let login = { success: false };
    let toekn = "";
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
        toekn = login.authToken;
    }

    const transactionState = [];

    const [allTransactions, setallTransactions] = useState(transactionState);

    // Get all Transactions
    const getTransactions = async () => {
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
        setallTransactions(json);
    };

    // Get all deleted Transactions
    const getDeletedTransactions = async () => {
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
        setallTransactions(json);
    };

    // Add Customer
    const addTransaction = async (customer, date, tone_quantity, unit_price, fuel_type, t_type, details, drive, palit, page, status) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                customer: customer,
                date: date,
                tone_quantity: tone_quantity,
                unit_price: unit_price,
                fuel_type: fuel_type,
                t_type: t_type,
                details: details,
                drive: drive,
                palit: palit,
                page: page,
                status: status,
            }),
        });
        // if no error fecth the data
        const newTransaction = await response.json();
        if (!("errors" in newTransaction)) {
            // update the all customers list
            setallTransactions(allTransactions.concat(newTransaction));
        }
        return newTransaction;
    };

    // Delete Customer
    const deleteTransaction = async (id) => {
        // call API to add the customer to the database
        await fetch(`${host}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        // return all customers except the deleted one
        const newCustomer = allTransactions.filter((customer) => {
            return customer._id !== id;
        });
        // update all customers list
        setallTransactions(newCustomer);
    };

    // Undo Delete Transaction
    const undoDeletedTransaction = async (id) => {
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
    const editTransaction = async (id, customer, details, tone_quantity, fuel_type, unit_price, t_type, date, driver, palit, page) => {
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
                tone_quantity: tone_quantity,
                fuel_type: fuel_type,
                unit_price: unit_price,
                t_type: t_type,
                date: date,
                driver: driver,
                palit: palit,
                page: page,
            }),
        });
        // find the customer that needs to be updated from customers list
        let updateCustomer = allTransactions.filter((customer) => {
            return customer._id === id;
        });

        // update the filtered customer
        updateCustomer._id = id;
        updateCustomer.customer = customer;
        updateCustomer.details = details;
        updateCustomer.tone_quantity = tone_quantity;
        updateCustomer.fuel_type = fuel_type;
        updateCustomer.unit_price = unit_price;
        updateCustomer.t_type = t_type;
        updateCustomer.date = date;
        updateCustomer.date = date;
        updateCustomer.driver = driver;
        updateCustomer.palit = palit;
        updateCustomer.page = page;

        // get all customers except the updated one
        const newCustomerList = allTransactions.filter((customer) => {
            return customer._id !== id;
        });

        // bind tow list and set it as customer list
        const updatedCustomerList = newCustomerList.concat(updateCustomer);

        // update customer status
        setallTransactions(updatedCustomerList);
    };

    return (
        <transactionContext.Provider
            value={{
                allTransactions,
                addTransaction,
                deleteTransaction,
                editTransaction,
                getTransactions,
                getDeletedTransactions,
                undoDeletedTransaction,
            }}
        >
            {props.children}
        </transactionContext.Provider>
    );
};

export default TransactionState;
