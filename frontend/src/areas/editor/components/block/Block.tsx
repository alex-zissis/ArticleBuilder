import React, {useContext, useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import {NewBlock} from '~/areas/editor/components/new-block';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {Trash} from 'react-feather';
import {ContentBlock, ImageBlock, TitleBlock} from './blocks';
import {IBlock} from '~/App.types';
import './block.scss';

interface BlockProps {
    block: IBlock;
    focusedBlock: number;
    i: number;
    onFocus: () => void;
    onBlur: () => void;
}

const Block: React.FC<BlockProps> = ({block, focusedBlock, i, onFocus, onBlur}) => {
    const blockRef = useRef<HTMLDivElement>();
    const [isFocused, setIsFocused] = useState(i === focusedBlock);
    const {updateBlock} = useContext(EditorContext);

    const handleClick = ({target}: MouseEvent) => {
        if (blockRef.current.contains(target as Node)) {
            return;
        }

        onBlur();
    };

    useEffect(() => {
        if (isFocused) {
            document.addEventListener('mousedown', handleClick);
            return () => {
                document.removeEventListener('mousedown', handleClick);
            };
        }
    }, [isFocused]);

    const [isHovered, setIsHovered] = useState(false);
    const {removeBlock} = useContext(EditorContext);

    useEffect(() => {
        setIsFocused(focusedBlock === i);
    }, [focusedBlock, i]);

    const getBlockRender = () => {
        switch (block.type) {
            case 'title': {
                return (
                    <TitleBlock
                        className="c-block__inner"
                        id={block.id}
                        isFocused={isFocused}
                        content={block.content}
                        onFocus={() => onFocus()}
                        onBlur={() => onBlur()}
                        onUpdate={(block) => updateBlock(block, i)}
                    />
                );
            }
            case 'content': {
                return (
                    <ContentBlock
                        className="c-block__inner"
                        id={block.id}
                        isFocused={isFocused}
                        slateContent={block.slateContent}
                        htmlContent={block.htmlContent}
                        onFocus={() => onFocus()}
                        onBlur={() => onBlur()}
                        onUpdate={(block) => updateBlock(block, i)}
                    />
                );
            }
            case 'image': {
                return (
                    <ImageBlock
                        className="c-block__inner"
                        id={block.id}
                        isFocused={isFocused}
                        src={block.src}
                        onFocus={() => onFocus()}
                        onBlur={() => onBlur()}
                        onUpdate={() => {}}
                    />
                );
            }
            default: {
                return <pre>Unknown</pre>;
            }
        }
    };

    return (
        <div
            className={cx('c-block', {'c-block--hovered': isHovered, 'c-block--focused': isFocused})}
            ref={blockRef}
            onMouseEnter={() => {
                if (focusedBlock === null || isFocused) setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}>
            <>
                {getBlockRender()}
                {(isHovered || isFocused) && (
                    <>
                        <div className="c-block__new-block">
                            <NewBlock i={i} isFocused={isFocused} loseFocus={() => setIsHovered(false)} />
                        </div>
                        {!block.isLocked && (
                            <div
                                className="c-block__delete-block"
                                onClick={() => {
                                    removeBlock(i);
                                    setIsHovered(false);
                                }}>
                                <Trash color="white" size={18} />
                            </div>
                        )}
                    </>
                )}
            </>
        </div>
    );
};

export {Block};
