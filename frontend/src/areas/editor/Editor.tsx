import React, {useContext, useState} from 'react';
import {EditorContext} from './EditorProvider';
import {Block} from './components/block';
import {NewBlock} from './components/new-block';
import './editor.scss';

const Editor: React.FC = () => {
    const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
    const {blocks, isLoading, saveArticle} = useContext(EditorContext);

    return (
        <div className="c-page">
            <div className="c-editor">
                {isLoading ? (
                    <p>loading...</p>
                ) : (
                    <>
                        <div className="c-editor__blocks">
                            {blocks.map((block, i) => (
                                <Block
                                    key={i}
                                    block={block}
                                    i={i}
                                    focusedBlock={focusedBlock}
                                    onFocus={() => setFocusedBlock(i)}
                                    onBlur={() => setFocusedBlock(null)}
                                />
                            ))}
                        </div>
                        {blocks.length === 0 && (
                            <NewBlock loseFocus={() => setFocusedBlock(null)} isFocused={true} i={0} />
                        )}
                    </>
                )}
            </div>
            <button
                onClick={() => {
                    saveArticle();
                }}>
                Save
            </button>
        </div>
    );
};

export {Editor};
