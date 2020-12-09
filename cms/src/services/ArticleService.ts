import {Service} from 'typedi';
import {getConnection} from 'typeorm';
import {Article} from '../models';
import {NewArticleInput, UpdatedArticleContentInput} from '../resolvers/ArticleResolver';

@Service()
class ArticleService {
    async findById(id: string): Promise<Article | undefined> {
        return getConnection().getRepository(Article).findOne(id);
    }

    async find(): Promise<Article[]> {
        return getConnection().getRepository(Article).find();
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
}

export {ArticleService};
