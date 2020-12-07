export {ContentBlock} from './content-block';
export {ImageBlock} from './image-block';
export {TitleBlock} from './title-block';

export interface BaseBlockProps<T> {
    className: string;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onUpdate: (block: Omit<T, 'type'>) => void;
}