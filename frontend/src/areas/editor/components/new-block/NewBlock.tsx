import React, {useContext, useEffect, useState} from 'react';
import cx from 'classnames';
import {Plus, Image} from 'react-feather';
import {IBlock, BlockType} from '~/App.Types';
import {getRandomString} from '~/App.Utils';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {serialize} from '../slate-editor';
import './new-block.scss';

interface NewBlockProps {
    isFocused: boolean;
    isDefault?: boolean;
    i: number;
    loseFocus: () => void;
}

const NewBlock: React.FC<NewBlockProps> = ({isFocused, i, loseFocus, isDefault = false}) => {
    const [isToolbarShown, setIsToolbarShown] = useState(false);
    const {addBlock} = useContext(EditorContext);

    useEffect(() => {
        if (!isFocused && isToolbarShown) {
            setIsToolbarShown(false);
        }
    }, [isFocused]);

    const handleAddBlock = (blockType: BlockType) => {
        const id = getRandomString();
        const defaultContentBlock = [
            {
                type: 'paragraph',
                children: [{text: 'New block'}],
            },
        ];
        const blockConfig: Record<BlockType, IBlock> = {
            [BlockType.Content]: {
                id,
                type: BlockType.Content,
                slateContent: defaultContentBlock,
                htmlContent: serialize({
                    children: [...defaultContentBlock],
                }),
            },
            [BlockType.Image]: {
                id,
                type: BlockType.Image,
                src: 'https://www.rentsimple.com.au/img/coming-soon-hero.jpg',
            },
            [BlockType.Title]: {
                id,
                type: BlockType.Title,
                content: 'Article title',
            },
        };

        addBlock({...blockConfig[blockType]}, i);
        loseFocus();
    };

    return (
        <div className={cx('c-new-block', {'c-new-block--is-default': isDefault})}>
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
