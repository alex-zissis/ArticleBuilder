import {Service} from 'typedi';
import {getConnection} from 'typeorm';
import {Article} from '../models';
import {NewArticleInput, PublishArticleInput, UpdatedArticleContentInput} from '../resolvers/ArticleResolver';

@Service()
class ArticleService {
    async findById(id: string): Promise<Article | undefined> {
        return getConnection().getRepository(Article).findOne(id);
    }

    async find({skip, take}: {skip: number; take: number}): Promise<Article[]> {
        return getConnection()
            .getRepository(Article)
            .find({skip, take, order: {updatedAt: 'DESC'}});
    }

    async addArticle({data}: {data: NewArticleInput}): Promise<Article> {
        const a = new Article();
        a.title = data.title;
        a.description = data.description;
        a.content = data.content;

        const article = await getConnection().manager.save(a);
        return article;
    }

    async updateArticleContent({data}: {data: UpdatedArticleContentInput}): Promise<Article | undefined> {
        const a = await this.findById(data._id);
        if (!a) {
            return undefined;
        }
        a.content = data.content;
        a.title = data.title;

        const article = await getConnection().manager.save(a);
        return article;
    }

    async publishArticle({
        data,
    }: {
        data: PublishArticleInput;
    }): Promise<Pick<Article, '_id' | 'isActive' | 'publishedAt' | 'updatedAt'> | undefined> {
        const a = await this.findById(data._id);
        if (!a) {
            return undefined;
        }

        a.isActive = true;
        a.publishedAt = Number(new Date());

        const {_id, updatedAt, publishedAt, isActive} = await getConnection().manager.save(a);
        return {_id, updatedAt, publishedAt, isActive};
    }
}

export {ArticleService};
