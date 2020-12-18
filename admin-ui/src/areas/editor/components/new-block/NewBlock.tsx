import React, {useContext, useEffect, useState} from 'react';
import cx from 'classnames';
import {Plus, Image} from 'react-feather';
import {IBlock, BlockType} from '~/App.Types';
import {getRandomString} from '~/App.Utils';
import {EditorContext} from '~/areas/editor/EditorProvider';
import {serialize} from '../slate-editor';
import './new-block.scss';
import { NewBlockToolbar } from './new-block-toolbar';

interface NewBlockProps {
    isFocused: boolean;
    isDefault?: boolean;
    i: number;
    loseFocus: () => void;
    onToolbarToggled?: (isToolbarShown: boolean) => void;
}

const NewBlock: React.FC<NewBlockProps> = ({isFocused, i, loseFocus, onToolbarToggled, isDefault = false}) => {
    const [isToolbarShown, setIsToolbarShown] = useState(false);

    useEffect(() => {
        if (onToolbarToggled) {
            onToolbarToggled(isToolbarShown);
        }
    }, [isToolbarShown])
    
    useEffect(() => {
        if (!isFocused && isToolbarShown) {
            setIsToolbarShown(false);
        }
    }, [isFocused]);

    return (
        <div className={cx('c-new-block', {'c-new-block--is-default': isDefault})}>
            {isToolbarShown ? (
                <NewBlockToolbar i={i} loseFocus={loseFocus} isDefault={isDefault} />
            ) : (
                <div className="c-new-block__icon" onClick={() => setIsToolbarShown(true)}>
                    <Plus size={18} color={'white'} strokeWidth={2} />
                </div>
            )}
        </div>
    );
};

export {NewBlock};
