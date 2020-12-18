import React, {useEffect} from "react";
import cx from "classnames";
import {X} from "react-feather";
import "./toast.scss";

export interface ToastProps {
    type?: "info" | "warning" | "error" | "success";
    heading?: string;
    expires?: number;
    isDismissable?: boolean;
    onExpire: () => void;
    body: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({
    body,
    heading,
    onExpire,
    expires = 5000,
    isDismissable = true,
    type = "info",
}) => {
    useEffect(() => {
        const interval = setTimeout(() => {
            onExpire();
        }, expires);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={cx("c-toast", `c-toast--${type}`)}>
            {isDismissable && (
                <div className="c-toast__dismiss" onClick={() => onExpire()}>
                    <X size={18} />
                </div>
            )}
            {heading && <div className="c-toast__heading">{heading}</div>}
            <div className="c-toast__info">{body}</div>
        </div>
    );
};

export {Toast};
