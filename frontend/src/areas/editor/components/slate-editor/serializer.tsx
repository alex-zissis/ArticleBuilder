import escapeHtml from 'escape-html';
import {Node, Text} from 'slate';

const serialize = (node: Node) => {
    if (Text.isText(node)) {
        let child = escapeHtml(node.text);
        if (node.bold) {
            child = `<strong>${child}</strong>`;
        }
        if (node.italic) {
            child = `<em>${child}</em>`;
        }
        if (node.underline) {
            child = `<u>${child}</u>`;
        }
        if (node.code) {
            child = `<code>${child}</strong>`;
        }

        return child;
    }

    const children = node.children.map((n) => serialize(n)).join('');

    switch (node.type) {
        case 'quote':
            return `<blockquote><p>${children}</p></blockquote>`;
        case 'heading-one':
            return `<h2>${children}</h2>`;
        case 'heading-two':
            return `<h3>${children}</h3>`;
        case 'paragraph':
            return `<p>${children}</p>`;
        case 'block-quote':
            return `<blockquote>${children}</blockquote>`;
        case 'link':
            return `<a href="${escapeHtml(node.url as string)}">${children}</a>`;
        default:
            return children;
    }
};

export {serialize};
