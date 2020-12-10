import React, {useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {IDescriptionBlock} from '~/App.Types';
import {BaseBlockProps} from '../index';
import './description-block.scss';

const DescriptionBlock: React.FC<BaseBlockProps<IDescriptionBlock> & Omit<IDescriptionBlock, 'type'>> = ({
    className,
    description,
    isFocused,
    onFocus,
    onBlur,
    onUpdate,
}) => {
    const [hasDoneInitialUpdate, setHasDoneInitialUpdate] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);
    const taRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isFocused) {
            taRef.current.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!hasDoneInitialUpdate) {
            setHasDoneInitialUpdate(true);
            return;
        }

        taRef.current.style.height = `auto`;
        console.log(taRef.current.scrollHeight, taRef.current.clientHeight);

        taRef.current.style.height = `${taRef.current.scrollHeight}px`;
        onUpdate({description: editedDescription});
    }, [editedDescription]);

    return !isFocused ? (
        <p onClick={() => onFocus()} className={cx(className, 'c-description-block')}>
            {editedDescription}
        </p>
    ) : (
        <textarea
            ref={taRef}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            className={cx(className, 'c-description-block', 'c-description-block__input')}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.currentTarget.value)}
            style={{height: '16px'}}
        />
    );
};

export {DescriptionBlock};
