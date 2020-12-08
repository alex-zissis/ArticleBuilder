import React, {useContext, useState} from 'react';
import {DragDropContext, Droppable, DropResult, Draggable} from 'react-beautiful-dnd';
import {EditorContext} from './EditorProvider';
import {Block} from './components/block';
import {NewBlock} from './components/new-block';
import {Page} from '~/components/page';
import './editor.scss';

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const Editor: React.FC = () => {
    const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
    const {blocks, isLoading, reorderBlocks} = useContext(EditorContext);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const reorderedBlocks = reorder(blocks, result.source.index, result.destination.index);
        reorderBlocks(reorderedBlocks);
    };

    return (
        <Page>
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
                                                <Draggable key={block.id} draggableId={block.id} index={i}>
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
                        {blocks.length === 0 && (
                            <NewBlock loseFocus={() => setFocusedBlock(null)} isFocused={true} i={0} />
                        )}
                    </>
                )}
            </div>
        </Page>
    );
};

export {Editor};
