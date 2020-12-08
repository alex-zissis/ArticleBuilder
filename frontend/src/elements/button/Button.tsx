import React from 'react';
import cx from 'classnames';
import './button.scss';

interface ButtonProps {
    appearence?: 'primary' | 'ghost' | 'secondary';
    disabled?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

const Button: React.FC<ButtonProps> = ({children, disabled, onClick, appearence = 'primary'}) => {
    return (
        <button onClick={onClick} className={cx('c-button', `c-button--${appearence}`, {'c-button--disabled': disabled})} disabled={disabled}>
            {children}
        </button>
    );
};

export {Button};
