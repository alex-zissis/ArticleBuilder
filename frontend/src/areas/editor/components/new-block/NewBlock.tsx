import React, {useContext, useEffect, useState} from 'react';
import {Plus, Image} from 'react-feather';
import {IBlock, BlockType} from '~/App.types';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {serialize} from '../slate-editor';
import './new-block.scss';

interface NewBlockProps {
    isFocused: boolean;
    i: number;
    loseFocus: () => void;
}

const NewBlock: React.FC<NewBlockProps> = ({isFocused, i, loseFocus}) => {
    const [isToolbarShown, setIsToolbarShown] = useState(false);
    const {addBlock} = useContext(EditorContext);

    useEffect(() => {
        if (!isFocused && isToolbarShown) {
            setIsToolbarShown(false);
        }
    }, [isFocused]);

    const handleAddBlock = (blockType: BlockType) => {
        const blockConfig: Record<BlockType, IBlock> = {
            [BlockType.Content]: {
                type: BlockType.Content,
                slateContent: [
                    {
                        type: 'paragraph',
                        children: [{text: 'New block'}],
                    },
                ],
                htmlContent: serialize({
                    children: [
                        ...[
                            {
                                type: 'paragraph',
                                children: [{text: 'New block'}],
                            },
                        ],
                    ],
                }),
            },
            [BlockType.Image]: {
                type: BlockType.Image,
                src: 'https://www.rentsimple.com.au/img/coming-soon-hero.jpg',
            },
            [BlockType.Title]: {
                type: BlockType.Title,
                content: 'Article title',
            },
        };

        addBlock({...blockConfig[blockType]}, i);
        loseFocus();
    };

    return (
        <div className="c-new-block">
            {isToolbarShown ? (
                <div className="c-new-block__toolbar">
                    <button className="c-new-block__toolbar-button">
                        <div className="c-new-block__fake-icon" onClick={() => handleAddBlock(BlockType.Title)}>
                            H
                        </div>
                    </button>
                    <button className="c-new-block__toolbar-button" onClick={() => handleAddBlock(BlockType.Content)}>
                        <div className="c-new-block__fake-icon">p</div>
                    </button>
                    <button className="c-new-block__toolbar-button" onClick={() => handleAddBlock(BlockType.Image)}>
                        <Image color="white" size={18} />
                    </button>
                </div>
            ) : (
                <div className="c-new-block__icon" onClick={() => setIsToolbarShown(true)}>
                    <Plus size={18} color={'white'} strokeWidth={2} />
                </div>
            )}
        </div>
    );
};

export {NewBlock};
