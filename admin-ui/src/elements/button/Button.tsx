import React from 'react';
import cx from 'classnames';
import {Link} from 'react-router-dom';
import './button.scss';

interface ButtonProps {
    appearence?: 'primary' | 'ghost' | 'secondary' | 'link';
    disabled?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    href?: string;
    compact?: boolean;
}

const Button: React.FC<ButtonProps> = ({children, disabled, onClick, href, compact, appearence = 'primary'}) => {
    const props = {
        onClick,
        className: cx('c-button', `c-button--${appearence}`, {'c-button--disabled': disabled, 'c-button--compact': compact}),
        disabled,
    };

    return appearence === 'link' ? <Link to={href} {...props}>{children}</Link> : <button {...props}>{children}</button>
};

export {Button};
