import {gql} from '@apollo/client';

const _ArticleContent = ` ... on ArticleBlockTitle {
    type
    id
    content
}
... on ArticleBlockContent {
    id
    type
    htmlContent
    slateContent {
        type
        children {
            text
            italic
            bold
            underline
            code
        }
    }
}
... on ArticleBlockImage {
    id
    type
    src
}`;

const GQLGetArticleById = gql`
    query GetArticle($id: String!) {
        article(_id: $id) {
            _id
            title
            createdAt
            description
            content {
                ${_ArticleContent}
            }
        }
    }
`;

const GQLAddArticle = gql`
    mutation AddArticle($newArticleInput: NewArticleInput!) {
        addArticle(
            newArticleData: $newArticleInput
        ) {
            _id
            title
            description
            content {
                ${_ArticleContent}
            }
        }
    }
`;

const GQLUpdateArticleContent = gql`
    mutation UpdateArticleContent($updatedArticleContent: UpdatedArticleContentInput!) {
        updateArticleContent(
            updatedArticleContent: $updatedArticleContent
        ) {
            _id
            title
            description
            content {
                ${_ArticleContent}
            }
        }
    }
`;

export {GQLGetArticleById, GQLAddArticle, GQLUpdateArticleContent};
