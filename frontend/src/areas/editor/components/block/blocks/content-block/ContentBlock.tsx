import React, {useEffect, useState} from 'react';
import {IContentBlock, ISlateContent} from '~/App.types';
import {SlateEditor, serialize} from '~/areas/editor/components/slate-editor';
import {BaseBlockProps} from '../index';
import './content-block.scss';

const ContentBlock: React.FC<BaseBlockProps<IContentBlock> & Omit<IContentBlock, 'type'>> = ({
    slateContent,
    htmlContent,
    isFocused,
    onFocus,
    onUpdate,
}) => {
    const [hasDoneInitialUpdate, setHasDoneInitialUpdate] = useState(false);
    const [editedContent, setEditedContent] = useState(slateContent);
    const [editedHtmlContent, setEditedHtmlContent] = useState(htmlContent);

    useEffect(() => {
        setEditedHtmlContent(serialize({children: [...editedContent]}));
    }, [editedContent]);

    useEffect(() => {
        if (!hasDoneInitialUpdate) {
            setHasDoneInitialUpdate(true);
            return;
        }
        
        onUpdate({htmlContent: editedHtmlContent, slateContent: editedContent})
    }, [editedHtmlContent]);

    return (
        <div className="c-block__inner" onClick={() => onFocus()}>
            {!isFocused ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: editedHtmlContent,
                    }}
                />
            ) : (
                <SlateEditor
                    initialValue={editedContent}
                    onChange={(value: ISlateContent[]) => setEditedContent(value)}
                />
            )}
        </div>
    );
};

export {ContentBlock};
