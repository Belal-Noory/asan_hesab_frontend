import React, { useContext, useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import loginContext from "../../context/bussiness/login/loginContext";
import { useHistory } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./login.css";
function Login() {
    // Login
    const loginData = useContext(loginContext);
    const { getLogin } = loginData;
    const history = useHistory();

    const [Spinner, setSpinner] = useState(false)
    const [credentials, setcredentials] = useState({email:"",password:""});
    const [error, seterror] = useState(false)
    const toast = useRef(null);

    const setCredendtials = (e)=>{
        setcredentials({...credentials,[e.target.name]:e.target.value})
    }
    
    useEffect(() => {
        let login = {success:false};
        if (localStorage.getItem("login") !== null) {
            login = JSON.parse(localStorage.getItem("login"));
        }
        if(login.success)
        {
            history.push("/");
        }
    }, [])
    

    const doLogin = async ()=>{
        setSpinner(true);
        if (!Object.values(credentials).every((x) => x === null || x === "" || x === 0)) {
           const res = await getLogin(credentials.email,credentials.password);
            if(!res.success){
                toast.current.show({
                    severity: "error",
                    summary: "خطآ",
                    detail: "لطفآ ایمیل وپاسورد درست را وارد کنید",
                });
                setSpinner(false);
            }
            else{
                localStorage.setItem("login",JSON.stringify(res));
                setSpinner(false);
                history.push("/");
            }
        }
        else{
            seterror(true);
            toast.current.show({
                severity: "error",
                summary: "خطآ",
                detail: "لطفآ فورم را درست خانه پوری کنید",
            });
            setSpinner(false);
        }
    }

    return (
        <div className="bg-light main">
            <div className="grid m-0 p-0">
                <div className="col-12 md:col-6 p-0 m-0">
                    <div className="bg-primary text-white text-center infography">
                        <i className="pi pi-heart" style={{ fontSize: "6rem" }}></i>
                        <h2 className="fs-1">به آسان حساب خوش آمدید</h2>
                    </div>
                </div>
                <div className="col-12 md:col-6 p-5 m-0 p-fluid form-conainer" dir="rtl">
                    <div className="container">
                        <div className="text-primary text-center">
                            <i className="pi pi-heart" style={{ fontSize: "6rem" }}></i>
                            <h2 className="fs-1"> آسان حساب</h2>
                        </div>
                        <div className="field">
                            <label htmlFor="email" style={{ fontSize: "1.3rem" }}>
                                ایمیل ادرس
                            </label>
                            <InputText type="text" value={credentials.email} name="email" id="email" className={error & credentials.email.length <= 0 ?"p-3 p-invalid":"p-3 "}  style={{ fontSize: "13px" }} placeholder="..." onChange={setCredendtials} />
                        </div>
                        <div className="field">
                            <label htmlFor="password" style={{ fontSize: "1.3rem" }}>
                                پاسورد/رمز عبوری
                            </label>
                            <InputText type="password" value={credentials.password} id="password" name="password" className={error & credentials.password.length <= 0 ?"p-3 p-invalid":"p-3 "} style={{ fontSize: "13px" }} placeholder="..." onChange={setCredendtials} />
                        </div>
                        <div className="flex">
                            <Button label="ورود به سیستم" icon={Spinner ? "pi pi-spin pi-spinner" : "pi pi-check"} className="mx-1 p-3" onClick={doLogin} disabled={Spinner} style={{ fontSize: "13px" }} />
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} position="top-right" dir="ltr" className="text-right" />
        </div>
    );
}

export default Login;
