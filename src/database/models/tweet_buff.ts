import {Table, Column, Model, NotNull} from 'sequelize-typescript';

@Table({
    timestamps: false
})
export default class TweetBuff extends Model<TweetBuff> {

    @NotNull
    @Column
    tweet_id: string;

    @NotNull
    @Column
    date: Date;

}