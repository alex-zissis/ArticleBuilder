import React from 'react';
import { LogOut } from 'react-feather';
import {SidebarLink} from './sidebar-link';
import './sidebar.scss';

const Sidebar: React.FC = () => {
    return (
        <aside className="c-sidebar">
            <div className="c-sidebar__inner">
                <nav className="c-sidebar__links">
                    <SidebarLink to="/">Home</SidebarLink>
                    <SidebarLink to="/articles">Articles</SidebarLink>
                    <SidebarLink to="/users">Users</SidebarLink>
                </nav>
                <div className="c-sidebar__logout">
                    <LogOut onClick={() => {}} />
                </div>
            </div>
        </aside>
    );
};

export {Sidebar};
