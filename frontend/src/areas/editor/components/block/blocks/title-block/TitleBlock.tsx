import React, {useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {ITitleBlock} from '~/App.types';
import {BaseBlockProps} from '../index';
import './title-block.scss';

const TitleBlock: React.FC<BaseBlockProps<ITitleBlock> & Omit<ITitleBlock, 'type'>> = ({
    className,
    content,
    isFocused,
    onFocus,
    onBlur,
}) => {
    const [editedContent, setEditedContent] = useState(content);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return !isFocused ? (
        <h1 onClick={() => onFocus()} className={cx(className, 'c-title-block')}>
            {editedContent}
        </h1>
    ) : (
        <input
            ref={inputRef}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            className={cx(className, 'c-title-block', 'c-title-block__input')}
            value={editedContent}
            onChange={(e) => setEditedContent(e.currentTarget.value)}
        />
    );
};

export {TitleBlock};
