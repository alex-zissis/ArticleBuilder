import {getApolloContext, gql} from "@apollo/client";
import {sl} from "date-fns/esm/locale";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {ApiUrl} from "~/App.Constants";
import {AppContext} from "~/App.Provider";
import {
    IBlock,
    BlockType,
    ITitleBlock,
    GQLResponse,
    IArticle,
    IContentBlock,
    IDescriptionBlock,
    IImageBlock,
} from "~/App.Types";
import {
    ArticleBuilderFetch,
    getRandomString,
    stripTypenameFromContentBlocks,
} from "~/App.Utils";
import {
    GQLAddArticle,
    GQLGetArticleById,
    GQLUpdateArticleContent,
} from "~/queries/articles";

interface IArticleDetails {
    _id: string;
    title: string;
}

interface IEditorContext {
    articleDetails: IArticleDetails | null;
    isDirty: boolean;
    isLoading: boolean;
    blocks: IBlock[];
    setArticleDetails: (articleDetails: IArticleDetails) => void;
    addBlock: (block: IBlock, i?: number) => void;
    reorderBlocks: (blocks: IBlock[]) => void;
    removeBlock: (i: number) => void;
    updateBlock: (block: Partial<IBlock>, i: number) => void;
    saveArticle: () => void;
}

const initialContext: IEditorContext = {
    isLoading: true,
    isDirty: false,
    articleDetails: null,
    blocks: [
        {
            id: getRandomString(),
            type: BlockType.Title,
            content: "Article title",
            isLocked: true,
        },
        {
            id: getRandomString(),
            type: BlockType.Description,
            description: "Article Description",
            isLocked: true,
        },
    ],
    setArticleDetails: () => {},
    addBlock: () => {},
    reorderBlocks: () => {},
    removeBlock: () => {},
    updateBlock: () => {},
    saveArticle: () => {},
};

const EditorContext = createContext(initialContext);

const EditorProvider: React.FC = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [blocks, setBlocks] = useState<IBlock[]>([]);
    const [
        articleDetails,
        setArticleDetails,
    ] = useState<IArticleDetails | null>(null);
    const {articleId} = useParams() as {articleId: string | undefined};
    const {client} = useContext(getApolloContext());
    const {showNotification, clearNotifications} = useContext(AppContext);

    const history = useHistory();

    useEffect(() => {
        if (!articleDetails && articleId) {
            client
                .query<{article: IArticle}>({
                    query: GQLGetArticleById,
                    variables: {id: articleId},
                })
                .then(
                    ({
                        data: {
                            article: {_id, title, content},
                        },
                    }) => {
                        setArticleDetails({_id, title});
                        setBlocks(content.map(stripTypenameFromContentBlocks));
                        setIsLoading(false);
                    }
                );
        } else {
            setIsLoading(false);
            setBlocks(initialContext.blocks);
        }
    }, []);

    const handleSaveSuccess = () => {
        showNotification({
            heading: "Save successful",
            body: <p>Your article was saved successfully</p>,
            type: "success",
            onExpire: clearNotifications,
        });
        setIsDirty(false);
    };

    const handleSaveError = (err: Error) => {
        showNotification({
            heading: "Error saving article",
            body: (
                <p>
                    There was an error saving your article, please try again
                    later.
                </p>
            ),
            type: "error",
            onExpire: clearNotifications,
        });
        console.error(err);
    };

    const saveArticle = () => {
        const isUpdate = Boolean(articleDetails);

        if (isUpdate) {
            client
                .mutate<{article: IArticle}>({
                    mutation: GQLUpdateArticleContent,
                    variables: {
                        updatedArticleContent: {
                            _id: articleDetails._id,
                            title: getTitle(),
                            description: getDescription(),
                            content: blocks,
                        },
                    },
                })
                .then((res) => {
                    handleSaveSuccess();
                })
                .catch(handleSaveError);
        } else {
            client
                .mutate<{addArticle: IArticle}>({
                    mutation: GQLAddArticle,
                    variables: {
                        newArticleInput: {
                            title: getTitle(),
                            description: getDescription(),
                            content: blocks,
                        },
                    },
                })
                .then(
                    ({
                        data: {
                            addArticle: {_id, title},
                        },
                    }) => {
                        setArticleDetails({_id, title});
                        handleSaveSuccess();
                        history.push(`/editor/${_id}`);
                    }
                )
                .catch(handleSaveError);
        }
    };

    const getTitle = () =>
        (blocks.find(
            (block) => block.type === BlockType.Title && block.isLocked
        ) as ITitleBlock).content;

    const getDescription = () =>
        (blocks.find(
            (block) => block.type === BlockType.Description && block.isLocked
        ) as IDescriptionBlock).description;

    const addBlock = (block: IBlock, i?: number) => {
        const location = typeof i !== "undefined" ? i + 1 : blocks.length;
        const b = [...blocks];
        b.splice(location, 0, block);
        setBlocks(b);
        setIsDirty(true);
    };

    const removeBlock = (i: number) => {
        const b = [...blocks].filter((_, idx) => idx !== i);

        if (blocks[i].type === BlockType.Image) {
            deleteImage(blocks[i] as IImageBlock);
        }

        setBlocks(b);
        setIsDirty(true);
    };

    const updateBlock = (block: Partial<Omit<IBlock, "type">>, i: number) => {
        const b = [...blocks];
        b[i] = {...b[i], ...block};
        setBlocks(b);
        setIsDirty(true);
    };

    const reorderBlocks = (blocks: IBlock[]) => {
        setBlocks(blocks);
        setIsDirty(true);
    };

    const deleteImage = (block: IImageBlock) => {
        const urlElements = block.src.split("/");
        const filename = urlElements[urlElements.length - 1];
        fetch(`http://localhost:4000/api/v1/image/${filename}`, {
            method: "DELETE",
        });
    };

    return (
        <EditorContext.Provider
            value={{
                blocks,
                addBlock,
                reorderBlocks,
                removeBlock,
                updateBlock,
                isLoading,
                isDirty,
                articleDetails,
                setArticleDetails,
                saveArticle,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};

export {EditorProvider, EditorContext};
export default EditorProvider;
