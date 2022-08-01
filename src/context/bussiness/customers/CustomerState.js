import React, { useState } from "react";
import customerContext from "./customerContext";
import Axios from "axios";
import { CUSTOMERS_URL } from "../../../DBconfig";

const CustomerState = (props) => {
    // host/backend server url
    const host = CUSTOMERS_URL;
    let login = { success: false };
    let toekn = "";
    if (localStorage.getItem("login") !== null) {
        login = JSON.parse(localStorage.getItem("login"));
        toekn = login.authToken;
    }
    const customersState = [];

    const [allCustomers, setallCustomers] = useState(customersState);
    const [allStaffs, setallStaffs] = useState(customersState);

    // Get all Customer
    const getCustomers = async () => {
        // call API to add the customer to the database
        const customer = await fetch(`${host}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await customer.json();
        // update the all customers list
        setallCustomers(json);
    };

    // Get all Customer
    const getStaffs = async () => {
        // call API to add the customer to the database
        const customer = await fetch(`${host}/staffs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await customer.json();
        // update the all customers list
        setallStaffs(json);
    };

    // Get all Customer
    const getShareholder = async () => {
        // call API to add the customer to the database
        const customer = await fetch(`${host}/hodlers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await customer.json();
        // update the all customers list
        setallStaffs(json);
    };

    // Get all deleted Customer
    const getDeletedCustomers = async () => {
        // call API to add the customer to the database
        const customer = await fetch(`${host}/deleted`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await customer.json();
        // update the all customers list
        setallCustomers(json);
    };

    // Get all deleted staff
    const getDeletedStaff = async () => {
        // call API to add the customer to the database
        const customer = await fetch(`${host}/staffs/deleted`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        const json = await customer.json();
        // update the all customers list
        setallCustomers(json);
    };

    // Add Customer
    const addCustomer = async (name, phone) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({ name, phone }),
        });

        // if no error fecth the data
        const customer = await response.json();
        // update the all customers list
        setallCustomers(allCustomers.concat(customer));
        return customer;
    };

    // Add staff
    const addStaff = async (name, phone) => {
        // call API to add the customer to the database
        const response = await fetch(`${host}/staff/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({ name, phone }),
        });

        // if no error fecth the data
        const customer = await response.json();
        // update the all customers list
        setallStaffs(allCustomers.concat(customer));
        return customer;
    };

    // Delete Customer
    const deleteCustomer = async (id) => {
        // call API to add the customer to the database
        await fetch(`${host}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });

        // return all customers except the deleted one
        const newCustomer = allCustomers.filter((customer) => {
            return customer._id !== id;
        });
        // update all customers list
        setallCustomers(newCustomer);
    };

    // Delete Customer
    const deleteCustomers = (ids) => {
        // call API to add the customer to the database
        Axios.delete(`${host}/deletemany`, {
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            data: {
                source: ids,
            },
        })
            .then((response) => {
                if (response.data.modifiedCount > 0) {
                    // return all customers except the deleted one
                    let newCustomer = allCustomers.filter((customer) => {
                        return !ids.find((itemb) => {
                            return customer._id === itemb;
                        });
                    });

                    // update all customers list
                    setallCustomers(newCustomer);
                }
            })
            .catch((error) => {
                console.log("error " + error);
            });
    };

    // Edit Customer
    const editCustomer = async (id, name, phone) => {
        // call API to update the customer in the database
        await fetch(`${host}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
            }),
        });
        getCustomers();
    };

    // Undo Delete Customer
    const undoDeletedCustomer = async (id) => {
        // call API to update the customer in the database
        await fetch(`${host}/update/active/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": toekn,
            },
        });
    };

    return (
        <customerContext.Provider
            value={{
                allCustomers,
                addCustomer,
                deleteCustomer,
                editCustomer,
                getCustomers,
                getDeletedCustomers,
                undoDeletedCustomer,
                deleteCustomers,
                getStaffs,
                addStaff,
                allStaffs,
                getDeletedStaff,
                getShareholder,
            }}
        >
            {props.children}
        </customerContext.Provider>
    );
};

export default CustomerState;
