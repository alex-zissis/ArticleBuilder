import React, {createContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import { ApiUrl } from '~/App.Constants';
import {IBlock, BlockType} from '~/App.types';

interface IArticleDetails {
    _id: string;
    title: string;
}

interface IEditorContext {
    articleDetails: IArticleDetails | null;
    isLoading: boolean;
    blocks: IBlock[];
    setArticleDetails: (articleDetails: IArticleDetails) => void;
    addBlock: (block: IBlock, i?: number) => void;
    removeBlock: (i: number) => void;
    updateBlock: (block: Partial<IBlock>, i: number) => void;
    saveArticle: () => void;
}

const initialContext: IEditorContext = {
    isLoading: true,
    articleDetails: null,
    blocks: [{type: BlockType.Title, content: 'Article title', isLocked: true}],
    setArticleDetails: () => {},
    addBlock: () => {},
    removeBlock: () => {},
    updateBlock: () => {},
    saveArticle: () => {},
};

const EditorContext = createContext(initialContext);

const EditorProvider: React.FC = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const [articleDetails, setArticleDetails] = useState<IArticleDetails | null>(null);
    const {articleId} = useParams() as {articleId: string | undefined};
    const history = useHistory();

    useEffect(() => {
        if (!articleDetails && articleId) {
            fetch(`${ApiUrl}/api/v1/article/${articleId}`)
                .then((res) => {
                    return res.json();
                })
                .then(({_id, title, content}) => {
                    setArticleDetails({_id, title});
                    setBlocks(content);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setBlocks(initialContext.blocks);
        }
    }, []);

    const saveArticle = () => {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        if (!articleDetails) {
            fetch(`${ApiUrl}/api/v1/article`, {
                method: 'POST',
                body: JSON.stringify({title: blocks[0].content, content: blocks}),
                headers,
            })
                .then((res) => res.json())
                .then(({_id, title}) => {
                    setArticleDetails({_id, title})
                    history.push(`/editor/${_id}`)
                });
        } else {
            fetch(`${ApiUrl}/api/v1/article/${articleDetails._id}`, {
                method: 'PUT',
                body: JSON.stringify({title: blocks[0].content, content: blocks}),
                headers,
            })
                .then((res) => res.json())
                .then(({title}) => setArticleDetails({...articleDetails, title}));
        }
    };

    const addBlock = (block: IBlock, i?: number) => {
        const location = typeof i !== 'undefined' ? i + 1 : blocks.length;
        const b = [...blocks];
        b.splice(location, 0, block);
        setBlocks(b);
    };

    const removeBlock = (i: number) => {
        const b = [...blocks];
        b.splice(i, 1);
        setBlocks(b);
    };

    const updateBlock = (block: Partial<Omit<IBlock, 'type'>>, i: number) => {
        const b = [...blocks];
        b[i] = {...b[i], ...block};
        setBlocks(b);
    };

    return (
        <EditorContext.Provider
            value={{
                blocks,
                addBlock,
                removeBlock,
                updateBlock,
                isLoading,
                articleDetails,
                setArticleDetails,
                saveArticle,
            }}>
            {children}
        </EditorContext.Provider>
    );
};

export {EditorProvider, EditorContext};
