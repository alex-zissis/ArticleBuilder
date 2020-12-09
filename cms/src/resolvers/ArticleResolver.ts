import {ArrayMaxSize, Max, MaxLength, Min} from 'class-validator';
import {Arg, Args, ArgsType, Field, InputType, Int, Mutation, Query, Resolver} from 'type-graphql';
import {Article} from '../models';
import {ArticleService} from '../services';

@ArgsType()
class PaginationArgs {
    @Field((type) => Int)
    @Min(0)
    skip: number = 0;

    @Field((type) => Int)
    @Min(1)
    @Max(50)
    take: number = 25;
}

@InputType()
class SlateContentChildrenInput {
    @Field()
    text: string;

    @Field({nullable: true})
    bold?: boolean;

    @Field({nullable: true})
    italic?: boolean;

    @Field({nullable: true})
    underline?: boolean;

    @Field({nullable: true})
    code?: boolean;
}

@InputType()
class SlateContentInput {
    @Field()
    type: string;

    @Field((type) => [SlateContentChildrenInput])
    children: SlateContentChildrenInput[];
}

@InputType()
class ArticleContentInput {
    @Field()
    id: string;

    @Field({nullable: true})
    content: string;

    @Field((type) => [SlateContentInput], {nullable: true})
    slateContent: SlateContentInput[];

    @Field({nullable: true})
    htmlContent: string;

    @Field({nullable: true})
    src: string;

    @Field({nullable: true})
    isLocked: boolean;

    @Field()
    type: string;
}

@InputType()
class NewArticleInput {
    @Field()
    @MaxLength(50)
    title: string;

    @Field({nullable: true})
    @MaxLength(255)
    description?: string;

    @Field((type) => [ArticleContentInput])
    @ArrayMaxSize(30)
    content: ArticleContentInput[];
}

@InputType()
class UpdatedArticleContentInput {
    @Field()
    _id: string;

    @Field()
    @MaxLength(50)
    title: string;

    @Field((type) => [ArticleContentInput])
    @ArrayMaxSize(30)
    content: ArticleContentInput[];
}

@Resolver(Article)
class ArticleResolver {
    constructor(private articleService: ArticleService) {}

    @Query((returns) => Article)
    async article(@Arg('_id') _id: string) {
        const article = await this.articleService.findById(_id);
        if (article === undefined) {
            throw Error();
        }
        return article;
    }

    @Query((returns) => [Article])
    async articles(@Args() {skip, take}: PaginationArgs) {
        const articles = await this.articleService.find();
        if (articles === undefined) {
            throw Error();
        }
        return articles;
    }

    @Mutation((returns) => Article)
    async addArticle(@Arg('newArticleData') newArticleData: NewArticleInput): Promise<Article> {
        return this.articleService.addArticle({data: newArticleData});
    }

    @Mutation((returns) => Article)
    async updateArticleContent(@Arg('updatedArticleContent') updatedArticleContent: UpdatedArticleContentInput): Promise<Article> {
        const article = await this.articleService.updateArticleContent({data: updatedArticleContent});
        if (article === undefined) {
            throw Error();
        }

        return article;
    }
}

export {ArticleResolver, NewArticleInput, UpdatedArticleContentInput};
