import {createUnionType, Field, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@ObjectType()
class ArticleBlockBase {
    @Field()
    @PrimaryColumn()
    id: string;

    @Field()
    @Column()
    type: string;

    @Field({nullable: true})
    @Column({nullable: true})
    isLocked?: boolean;
}

@ObjectType()
@Entity()
class ArticleBlockTitle extends ArticleBlockBase {
    @Field()
    @Column()
    content: string;
}

@ObjectType()
@Entity()
class SlateContentChildren {
    @Field()
    @Column()
    text: string;

    @Field({nullable: true})
    @Column({nullable: true})
    bold?: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    italic?: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    underline?: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    code?: boolean;
}

@ObjectType()
@Entity()
class SlateContent {
    @Field()
    @Column()
    type: string;

    @Field((type) => [SlateContentChildren])
    @Column()
    children: SlateContentChildren[];
}

@ObjectType()
@Entity()
class ArticleBlockContent extends ArticleBlockBase {
    @Field()
    @Column()
    htmlContent: string;

    @Field((type) => [SlateContent])
    @Column()
    slateContent: SlateContent[];
}

@ObjectType()
@Entity()
class ArticleBlockImage extends ArticleBlockBase {
    @Field()
    @Column()
    src: string;
}

const ArticleContentUnion = createUnionType({
    name: 'ArticleContentType',
    types: () => [ArticleBlockImage, ArticleBlockContent, ArticleBlockTitle] as const,
    resolveType: (value) => {
        if ('content' in value) {
            return ArticleBlockTitle;
        }
        if ('htmlContent' in value) {
            return ArticleBlockContent;
        }
        if ('src' in value) {
            return ArticleBlockImage;
        }
        return undefined;
    },
});

export {
    ArticleContentUnion,
    ArticleBlockTitle,
    ArticleBlockContent,
    ArticleBlockImage,
    SlateContent,
    SlateContentChildren,
};
