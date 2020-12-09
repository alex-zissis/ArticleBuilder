import React, {useContext, useState} from 'react';
import {DragDropContext, Droppable, DropResult, Draggable} from 'react-beautiful-dnd';
import {EditorContext} from './EditorProvider';
import {Block} from './components/block';
import {NewBlock} from './components/new-block';
import {Page} from '~/components/page';
import {EditorHeader} from './components/editor-header';
import './editor.scss';

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const Editor: React.FC = () => {
    const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
    const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
    const {blocks, isLoading, reorderBlocks} = useContext(EditorContext);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination || result.source.index === result.destination.index || result.destination.index === 0) {
            return;
        }

        const reorderedBlocks = reorder(blocks, result.source.index, result.destination.index);
        reorderBlocks(reorderedBlocks);
    };

    return (
        <Page hasSidebar={false}>
            <EditorHeader />
            <div className="c-editor">
                {isLoading ? (
                    <p>loading...</p>
                ) : (
                    <>
                        <div className="c-editor__blocks">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {blocks.map((block, i) => (
                                                <Draggable
                                                    isDragDisabled={block.isLocked}
                                                    key={block.id}
                                                    draggableId={block.id}
                                                    index={i}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}>
                                                            <Block
                                                                block={block}
                                                                i={i}
                                                                focusedBlock={focusedBlock}
                                                                onFocus={() => setFocusedBlock(i)}
                                                                onBlur={() => setFocusedBlock(null)}
                                                                onMouseEnter={() => setHoveredBlock(i)}
                                                                onMouseLeave={() => setHoveredBlock(null)}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                        {(blocks.length === 0 || (focusedBlock === null && hoveredBlock === null)) && (
                            <NewBlock
                                isDefault={true}
                                loseFocus={() => setFocusedBlock(null)}
                                isFocused={true}
                                i={blocks.length}
                            />
                        )}
                    </>
                )}
            </div>
        </Page>
    );
};

export {Editor};
