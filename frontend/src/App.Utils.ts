import { BlockType, IBlock, IContentBlock, ISlateContent, ISlateChildren } from "./App.types";

export const getRandomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function ArticleBuilderFetch<ResponseType = object>(url: string, config: RequestInit = {}, body?: object) {
    const headers = new Headers();
    if (body) {
        config.body = JSON.stringify(body);
        headers.append('Content-Type', 'application/json');
    }
    config.headers = headers;

    return fetch(url, config).then(res => {
        if (res.ok) {
            return res.json() as Promise<ResponseType>;
        }

        throw Error();
    });
}

type WithTypename<Base> = Base & { __typename?: string };

const stripTypenameFromContentBlocks = (block: WithTypename<IBlock>) => {
    let { __typename, ...rest } = block;
    if (rest.type === BlockType.Content) {
        const b = rest as IContentBlock;
        b.slateContent = b.slateContent.map((slateC: WithTypename<ISlateContent>) => {
            let { __typename, ...slateCRest } = slateC;



            return {

                ...slateCRest,
                children: slateC.children.map((child: WithTypename<ISlateChildren>) => {
                    let { __typename, ...childRest } = child;
                    return childRest;
                })
            }
        });
        rest = b;
    }
    return rest;
}


export { ArticleBuilderFetch, stripTypenameFromContentBlocks };