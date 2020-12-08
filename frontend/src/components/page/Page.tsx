import React from 'react';
import {Header} from '~/components/header';
import './page.scss';

const Page: React.FC = ({children}) => (
    <div className="c-page">
        <Header />
        <div className="c-page__inner">{children}</div>
    </div>
);

export {Page};
