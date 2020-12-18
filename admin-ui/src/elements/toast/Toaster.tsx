import React from 'react';
import './toaster.scss';

const Toaster: React.FC = ({children}) => {
    return <div className="c-toaster">
        {children}
    </div>
}

export {Toaster};