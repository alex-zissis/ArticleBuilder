import {Field, ObjectType, ID} from 'type-graphql';
import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from 'typeorm';
import {ArticleContentUnion} from './ArticleContent';

@ObjectType()
@Entity()
class Article {
    @ObjectIdColumn()
    @Field((type) => ID)
    _id: string;

    @Field()
    @Column()
    title: string;

    @Field((type) => [ArticleContentUnion], {nullable: true})
    @Column({nullable: true})
    content: typeof ArticleContentUnion[];

    @Field({nullable: true})
    @Column({nullable: true})
    description?: string;

    @Field({defaultValue: false})
    @Column({default: false})
    isActive: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    publishedAt: number;

    @Field()
    @CreateDateColumn()
    createdAt: number;

    @Field()
    @UpdateDateColumn()
    updatedAt: number;
}

export {Article};
