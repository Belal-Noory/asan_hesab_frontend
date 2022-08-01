import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

export const AppTopbar = (props) => {
    return (
        <div className={"layout-topbar " + props.hide} dir="rtl">
            <Link to="/" className="layout-topbar-logo">
                <span>آسان حساب</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive })}>
                <li>
                    <button className="p-link layout-topbar-button" id="logout" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-sign-out mx-1" />
                        <span>خارج شدن</span>
                    </button>
                </li>
                {/* <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-cog mx-1" />
                        <span>Settings</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-user mx-1" />
                        <span>Profile</span>
                    </button>
                </li> */}
            </ul>
        </div>
    );
};
