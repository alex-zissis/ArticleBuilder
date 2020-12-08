import React, {createContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { DefaultElement } from 'slate-react';
import {ApiUrl} from '~/App.Constants';
import {IBlock, BlockType, ITitleBlock} from '~/App.types';
import {ArticleBuilderFetch, getRandomString} from '~/App.Utils';

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
    const history = useHistory();

    useEffect(() => {
        if (!articleDetails && articleId) {
            ArticleBuilderFetch<IArticleDetails & {content: IBlock[]}>(`${ApiUrl}/api/v1/article/${articleId}`).then(
                ({_id, title, content}) => {
                    setArticleDetails({_id, title});
                    setBlocks(content);
                    setIsLoading(false);
                }
            );
        } else {
            setIsLoading(false);
            setBlocks(initialContext.blocks);
        }
    }, []);

    const saveArticle = () => {
        const saveConfig = {
            save: {
                url: () => `${ApiUrl}/api/v1/article`,
                method: 'POST',
            },
            update: {
                url: (articleId: string) => `${ApiUrl}/api/v1/article/${articleId}`,
                method: 'PUT',
            },
        };
        const {method, url} = saveConfig[Boolean(articleDetails) ? 'update' : 'save'];

        ArticleBuilderFetch<IArticleDetails>(
            url(articleDetails?._id),
            {
                method,
            },
            {title: getTitle(), content: blocks}
        ).then(({_id, title}) => {
            setArticleDetails({_id, title});
            setIsDirty(false);
            history.push(`/editor/${_id}`);
        });
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