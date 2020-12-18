export interface IBaseBlock {
    id: string;
    type: BlockType;
    isLocked?: boolean;
}

export type ISlateChildren = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
};

export type ISlateContent = {
    type: string;
    children: ISlateChildren[];
};

export interface IContentBlock extends IBaseBlock {
    type: BlockType.Content;
    slateContent: ISlateContent[];
    htmlContent: string;
}

export interface ITitleBlock extends IBaseBlock {
    type: BlockType.Title;
    content: string;
}

export interface IDescriptionBlock extends IBaseBlock {
    type: BlockType.Description;
    description: string;
}

export interface IImageBlock extends IBaseBlock {
    type: BlockType.Image;
    src?: string;
}

export enum BlockType {
    Content = 'content',
    Title = 'title',
    Image = 'image',
    Description = 'description',
}

export type GQLResponse<ResponseType> = {data: ResponseType};

export type IBlock = IContentBlock | ITitleBlock | IImageBlock | IDescriptionBlock;

export interface IArticle {
    _id: string;
    title: string;
    description?: string;
    content: IBlock[];
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    publishedAt?: string;
}
