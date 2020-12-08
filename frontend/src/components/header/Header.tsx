import React, {useContext} from 'react';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {Button} from '~/elements';
import './header.scss';

const Header: React.FC = () => {
    const {isDirty, saveArticle} = useContext(EditorContext);
    
    return (
        <header className="c-header">
            <div className="c-header__inner">
                <Button appearence="secondary" onClick={() => saveArticle()} disabled={!isDirty}>Save</Button>
            </div>
        </header>
    );
};

export {Header};
