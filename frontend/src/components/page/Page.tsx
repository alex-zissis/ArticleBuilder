import React from 'react';
import cx from 'classnames';
import {Sidebar} from '~/components/sidebar';
import './page.scss';

interface PageProps {
    hasSidebar?: boolean;
}

const Page: React.FC<PageProps> = ({children, hasSidebar = true}) => (
    <div className={cx("c-page", {"c-page--has-sidebar": hasSidebar})}>
        {hasSidebar && <Sidebar />}
        <div className="c-page__inner">{children}</div>
    </div>
);

export {Page};
