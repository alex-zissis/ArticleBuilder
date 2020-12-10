import {cx} from 'emotion';
import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './sidebar-link.scss';

interface SidebarLinkProps {
    to: string;
    isSelected?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({to, isSelected, children}) => {
    const {pathname} = useLocation();

    return (
        <div className={cx('c-sidebar-link', {'c-sidebar-link--selected': pathname === to || isSelected})}>
            <Link className="c-sidebar-link__link" to={to}>
                {children}
            </Link>
        </div>
    );
};

export {SidebarLink};
