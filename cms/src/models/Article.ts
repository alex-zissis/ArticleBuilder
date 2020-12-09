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
    isActive: false;

    @Field({nullable: true})
    @Column({nullable: true})
    publishedAt: Date;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    @Field()
    @UpdateDateColumn()
    updatedAt: string;
}

export {Article};
