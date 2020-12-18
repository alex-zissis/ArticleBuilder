import React, {useContext} from "react";
import cx from "classnames";
import {Sidebar} from "~/components/sidebar";
import {Toaster, Toast} from "~/elements";
import {AppContext} from "~/App.Provider";
import "./page.scss";

interface PageProps {
    hasSidebar?: boolean;
}

const Page: React.FC<PageProps> = ({children, hasSidebar = true}) => {
    const {notifications} = useContext(AppContext);

    return (
        <div className={cx("c-page", {"c-page--has-sidebar": hasSidebar})}>
            {hasSidebar && <Sidebar />}
            <div className="c-page__inner">{children}</div>
            {notifications.length > 0 && (
                <Toaster>
                    {notifications.map((toast) => (
                        <Toast {...toast} />
                    ))}
                </Toaster>
            )}
        </div>
    );
};

export {Page};
