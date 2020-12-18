import React, {useContext, useRef} from "react";
import cx from "classnames";
import {BlockType, IBlock} from "~/App.Types";
import {getRandomString} from "~/App.Utils";
import {EditorContext} from "~/areas/editor/EditorProvider";
import {serialize} from "../../slate-editor";
import {Image} from "react-feather";
import {Button} from "~/elements";
import "./new-block-toolbar.scss";
import useClickOutside from "~/hooks/useClickOutside";

interface NewBlockToolbarProps {
    isDefault?: boolean;
    i: number;
    loseFocus: () => void;
    arrowDirection?: "up" | "down";
}

const NewBlockToolbar: React.FC<NewBlockToolbarProps> = ({
    i,
    loseFocus,
    isDefault = false,
    arrowDirection = "up",
}) => {
    const {addBlock} = useContext(EditorContext);
    const toolbarRef = useRef<HTMLDivElement>();

    useClickOutside(toolbarRef, () => {
        loseFocus();
    })

    const handleAddBlock = (blockType: BlockType) => {
        const id = getRandomString();
        const defaultContentBlock = [
            {
                type: "paragraph",
                children: [{text: "New block"}],
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
            },
            [BlockType.Title]: {
                id,
                type: BlockType.Title,
                content: "Article title",
            },
            [BlockType.Description]: {
                id,
                type: BlockType.Description,
                description: "Article description",
            },
        };

        addBlock({...blockConfig[blockType]}, i);
        loseFocus();
    };

    return (
        <div
            className={cx(
                "c-new-block-toolbar",
                `c-new-block-toolbar--arrow-${arrowDirection}`,
                {"c-new-block-toolbar--is-default": isDefault}
            )}
            ref={toolbarRef}
        >
            <h3>Add a new block:</h3>
            <div className="c-new-block-toolbar__blocks">
                <Button
                    appearence="ghost"
                    onClick={() => handleAddBlock(BlockType.Title)}
                >
                    <div className="c-new-block-toolbar__button">
                        <Image className="c-new-block-toolbar__button-icon" />
                        Title
                    </div>
                </Button>
                <Button
                    appearence="ghost"
                    onClick={() => handleAddBlock(BlockType.Description)}
                >
                    <div className="c-new-block-toolbar__button">
                        <Image className="c-new-block-toolbar__button-icon" />
                        Description
                    </div>
                </Button>
                <Button
                    appearence="ghost"
                    onClick={() => handleAddBlock(BlockType.Content)}
                >
                    <div className="c-new-block-toolbar__button">
                        <Image className="c-new-block-toolbar__button-icon" />
                        Paragraph
                    </div>
                </Button>
                <Button
                    appearence="ghost"
                    onClick={() => handleAddBlock(BlockType.Image)}
                >
                    <div className="c-new-block-toolbar__button">
                        <Image className="c-new-block-toolbar__button-icon" />
                        Image
                    </div>
                </Button>
            </div>
        </div>
    );
};

export {NewBlockToolbar};
