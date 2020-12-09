import {getApolloContext, gql} from '@apollo/client';
import {sl} from 'date-fns/esm/locale';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {ApiUrl} from '~/App.Constants';
import {IBlock, BlockType, ITitleBlock, GQLResponse, IArticle, IContentBlock} from '~/App.Types';
import {ArticleBuilderFetch, getRandomString, stripTypenameFromContentBlocks} from '~/App.Utils';
import {GQLAddArticle, GQLGetArticleById, GQLUpdateArticleContent} from '~/queries/articles';

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
    blocks: [{id: getRandomString(), type: BlockType.Title, content: 'Article title', isLocked: true}],
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
    const [articleDetails, setArticleDetails] = useState<IArticleDetails | null>(null);
    const {articleId} = useParams() as {articleId: string | undefined};
    const {client} = useContext(getApolloContext());

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
                            content: blocks,
                        },
                    },
                })
                .then((res) => console.log(res));
        } else {
            client
                .mutate<{addArticle: IArticle}>({
                    mutation: GQLAddArticle,
                    variables: {
                        newArticleInput: {
                            title: getTitle(),
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
                        history.push(`/editor/${_id}`);
                    }
                );
        }
    };

    const getTitle = () => (blocks.find((block) => block.type === BlockType.Title) as ITitleBlock).content;

    const addBlock = (block: IBlock, i?: number) => {
        const location = typeof i !== 'undefined' ? i + 1 : blocks.length;
        const b = [...blocks];
        b.splice(location, 0, block);
        setBlocks(b);
        setIsDirty(true);
    };

    const removeBlock = (i: number) => {
        const b = [...blocks].filter((_, idx) => idx !== i);
        setBlocks(b);
        setIsDirty(true);
    };

    const updateBlock = (block: Partial<Omit<IBlock, 'type'>>, i: number) => {
        const b = [...blocks];
        b[i] = {...b[i], ...block};
        setBlocks(b);
        setIsDirty(true);
    };

    const reorderBlocks = (blocks: IBlock[]) => {
        setBlocks(blocks);
        setIsDirty(true);
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
            }}>
            {children}
        </EditorContext.Provider>
    );
};

export {EditorProvider, EditorContext};
export default EditorProvider;
