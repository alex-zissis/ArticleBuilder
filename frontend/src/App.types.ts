export interface IBaseBlock {
    type: BlockType;
    isLocked?: boolean;
}

type ISlateChildren = {
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

export interface IImageBlock extends IBaseBlock {
    type: BlockType.Image;
    src: string;
}

export enum BlockType {
    Content = 'content',
    Title = 'title',
    Image = 'image',
}

export type IBlock = IContentBlock | ITitleBlock | IImageBlock;
