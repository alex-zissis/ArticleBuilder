import {gql} from '@apollo/client';

const _ArticleContent = ` ... on ArticleBlockTitle {
    type
    id
    isLocked
    content
}
... on ArticleBlockContent {
    id
    type
    isLocked
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
    isLocked
    src
}
... on ArticleBlockDescription {
    id
    type
    isLocked
    description
}`;

const GQLGetArticles = (take: number = 5) => gql`
    query {
        articles(take: ${take}) {
            _id
            title
            createdAt
            updatedAt
            publishedAt
            isActive
            description
        }
    }
`;

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

const GQLPublishArticle = gql`
    mutation PublishArticle($publishArticleData: PublishArticleInput!) {
        publishArticle(publishArticleData: $publishArticleData) {
            _id
            isActive
            publishedAt
            updatedAt
        }
    }
`;

const GQLUploadImage = gql`
    mutation UploadImage($file: UploadImageInput!) {
        uploadImage(file: $file)
    }
`;

export {GQLGetArticleById, GQLAddArticle, GQLUpdateArticleContent, GQLPublishArticle, GQLGetArticles, GQLUploadImage};
