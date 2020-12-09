import React from 'react';
import './card.scss';

interface CardProps {
    heading?: string;
    meta?: Record<string, string>;
    footerSlot?: React.ReactNode | React.ReactNode[];
}

const Card: React.FC<CardProps> = ({heading, meta, footerSlot, children}) => {
    return (
        <div className="c-card">
            {heading && (
                <header className="c-card__header">
                    <h3 className="c-card__heading">{heading}</h3>
                </header>
            )}

            {meta && (
                <div className="c-card__meta">
                    <table className="c-card__meta-table">
                        <tbody>
                            {Object.entries(meta).map(([key, value], i) => (
                                <tr key={i}>
                                    <td className="c-card__meta-key">{key}:</td>
                                    <td className="c-card__meta-value">{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="c-card__body">
                {children}
            </div>
            {footerSlot && <footer className="c-card__footer">{footerSlot}</footer>}
        </div>
    );
};

export {Card};
