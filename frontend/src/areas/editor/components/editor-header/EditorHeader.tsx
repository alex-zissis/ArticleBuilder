import React, {useContext} from 'react';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {Button} from '~/elements';
import './editor-header.scss';

const EditorHeader: React.FC = () => {
    const {isDirty, saveArticle} = useContext(EditorContext);

    return (
        <header className="c-editor-header">
            <div className="c-editor-header__inner">
                <Button appearence="link" href="/">
                    Back
                </Button>
                <div className="c-editor-header__right">
                    <Button appearence="secondary" onClick={() => saveArticle()} disabled={!isDirty}>
                        Save
                    </Button>
                    <Button appearence="primary">Continue</Button>
                </div>
            </div>
        </header>
    );
};

export {EditorHeader};
