import {BlockType, IBlock, IContentBlock, ISlateContent, ISlateChildren} from './App.Types';
import {format} from 'date-fns';

export const getRandomString = () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function ArticleBuilderFetch<ResponseType = object>(url: string, config: RequestInit = {}, body?: object) {
    const headers = new Headers();
    if (body) {
        config.body = JSON.stringify(body);
        headers.append('Content-Type', 'application/json');
    }
    config.headers = headers;

    return fetch(url, config).then((res) => {
        if (res.ok) {
            return res.json() as Promise<ResponseType>;
        }

        throw Error();
    });
}

type WithTypename<Base> = Base & {__typename?: string};

const stripTypenameFromContentBlocks = (block: WithTypename<IBlock>) => {
    let {__typename, ...rest} = block;
    if (rest.type === BlockType.Content) {
        const b = rest as IContentBlock;
        b.slateContent = b.slateContent.map((slateC: WithTypename<ISlateContent>) => {
            let {__typename, ...slateCRest} = slateC;

            return {
                ...slateCRest,
                children: slateC.children.map((child: WithTypename<ISlateChildren>) => {
                    let {__typename, ...childRest} = child;
                    return childRest;
                }),
            };
        });
        rest = b;
    }
    return rest;
};

const formatTimestampAsDateTime = (timestamp: string) => format(new Date(Number(timestamp)), 'dd-MMM-yyyy p');

const getTimestampAsDateTimeOrDefault = (timestamp?: string, defaultStr = '-') =>
    Boolean(timestamp) ? formatTimestampAsDateTime(timestamp) : defaultStr;

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export {
    ArticleBuilderFetch,
    stripTypenameFromContentBlocks,
    formatTimestampAsDateTime,
    getTimestampAsDateTimeOrDefault,
    reorder,
};
