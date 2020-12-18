import React, {useEffect, useRef, useState} from "react";
import cx from "classnames";
import {IDescriptionBlock} from "~/App.Types";
import {BaseBlockProps} from "../index";
import ContentEditable from "react-contenteditable";
import "./description-block.scss";

const DescriptionBlock: React.FC<
    BaseBlockProps<IDescriptionBlock> & Omit<IDescriptionBlock, "type">
> = ({className, description, isFocused, onFocus, onBlur, onUpdate}) => {
    const [hasDoneInitialUpdate, setHasDoneInitialUpdate] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);
    const text = useRef(description);

    useEffect(() => {
        if (!hasDoneInitialUpdate) {
            setHasDoneInitialUpdate(true);
            return;
        }
        console.log(editedDescription);
        onUpdate({description: editedDescription});
    }, [editedDescription]);

    return !isFocused ? (
        <p
            onClick={() => onFocus()}
            className={cx(className, "c-description-block")}
        >
            {editedDescription}
        </p>
    ) : (
        <ContentEditable
            onFocus={() => onFocus()}
            html={text.current}
            onChange={(e) => {
                text.current = e.currentTarget.textContent;
                setEditedDescription(text.current);
            }}
            onBlur={() => onBlur()}
            className={cx(
                className,
                "c-description-block",
                "c-description-block__input"
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            }}
            contentEditable
            suppressContentEditableWarning={true}
        />
    );
};

export {DescriptionBlock};
