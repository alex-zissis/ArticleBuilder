import React from 'react';
import './section.scss';

interface SectionProps {
    actionSlot?: React.ReactNode;
    heading: string;
}

const Section: React.FC<SectionProps> = ({actionSlot, heading, children}) => {
    return <section className="c-section">
        <header className="c-section__header">
            <h2 className="c-section__heading">{heading}</h2>
            {actionSlot && (
                <div className="c-section__action-slot">
                    {actionSlot}
                </div>
            )}
        </header>
        <div className="c-section__body">
            {children}
        </div>
    </section>;
};

export {Section};
