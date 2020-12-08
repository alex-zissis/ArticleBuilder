import React, {useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {ITitleBlock} from '~/App.types';
import {BaseBlockProps} from '../index';
import './title-block.scss';
import { useEditor } from 'slate-react';

const TitleBlock: React.FC<BaseBlockProps<ITitleBlock> & Omit<ITitleBlock, 'type'>> = ({
    className,
    content,
    isFocused,
    onFocus,
    onBlur,
    onUpdate
}) => {
    const [hasDoneInitialUpdate, setHasDoneInitialUpdate] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!hasDoneInitialUpdate) {
            setHasDoneInitialUpdate(true);
            return;
        }

        onUpdate({content: editedContent});
    }, [editedContent])

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
