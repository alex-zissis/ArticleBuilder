import React, {Ref, PropsWithChildren} from 'react';
import ReactDOM from 'react-dom';
import {cx, css} from 'emotion';

interface BaseProps {
    className: string;
    [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean;
                reversed: boolean;
            } & BaseProps
        >,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: #fff;
                `
            )}
        />
    )
);

export const EditorValue = React.forwardRef(
    (
        {
            className,
            value,
            ...props
        }: PropsWithChildren<
            {
                value: any;
            } & BaseProps
        >,
        ref: Ref<OrNull<null>>
    ) => {
        const textLines = value.document.nodes
            .map((node) => node.text)
            .toArray()
            .join('\n');
        return (
            <div
                ref={ref}
                {...props}
                className={cx(
                    className,
                    css`
                        margin: 30px -20px 0;
                    `
                )}>
                <div
                    className={css`
                        font-size: 14px;
                        padding: 5px 20px;
                        color: #404040;
                        border-top: 2px solid #eeeeee;
                        background: #f8f8f8;
                    `}>
                    Slate's value as text
                </div>
                <div
                    className={css`
                        color: #404040;
                        font: 12px monospace;
                        white-space: pre-wrap;
                        padding: 10px 20px;
                        div {
                            margin: 0 0 0.5em;
                        }
                    `}>
                    {textLines}
                </div>
            </div>
        );
    }
);

export const Icon = React.forwardRef(
    ({className, active, ...props}: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                'material-icons',
                className,
                css`
                    background-color: ${active ? '#3a425d' : 'none'};
                    border-radius: 4px;
                    font-size: 24px;
                    vertical-align: text-bottom;
                `
            )}
        />
    )
);

export const Instruction = React.forwardRef(
    ({className, ...props}: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    white-space: pre-wrap;
                    margin: 0 -20px 10px;
                    padding: 10px 20px;
                    font-size: 14px;
                    background: #f8f8e8;
                `
            )}
        />
    )
);

export const Menu = React.forwardRef(
    ({className, ...props}: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    & > * {
                        display: inline-block;
                    }
                    & > * + * {
                        margin-left: 15px;
                    }
                `
            )}
        />
    )
);

export const Portal = ({children}) => {
    return ReactDOM.createPortal(children, document.body);
};

export const Toolbar = React.forwardRef(
    ({className, ...props}: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
        <Menu
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    position: absolute;
                    margin-top: -36px;
                    margin-left: -9px;
                    background-color: #3b425d;
                    background-color: #509cf6;
                    width: max-content;
                    padding: 0 8px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    box-sizing: border-box;
                    height: 32px;
                    font-size: 24px;
                `
            )}
        />
    )
);
