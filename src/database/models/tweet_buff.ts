import {Table, Column, Model, AllowNull} from 'sequelize-typescript';

@Table({
    timestamps: false
})
export default class TweetBuff extends Model<TweetBuff> {

    @AllowNull(false)
    @Column
    tweet_id: string;

    @AllowNull(false)
    @Column
    date: Date;

}