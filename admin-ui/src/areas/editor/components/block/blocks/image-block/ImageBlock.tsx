import {cx} from 'emotion';
import React from 'react';
import {IImageBlock} from '~/App.Types';
import {BaseBlockProps} from '../index';
import './image-block.scss';

const ImageBlock: React.FC<BaseBlockProps<IImageBlock> & Omit<IImageBlock, 'type'>> = ({className, isFocused, src}) => {
    return (
        <div className={cx(className, 'c-block-image')}>
            <img src={src} alt="" />
        </div>
    );
};

export {ImageBlock};
