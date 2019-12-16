import {Table, Column, Model, AllowNull} from 'sequelize-typescript';

@Table({
    timestamps: false,
    tableName: 'TweetBuffs'
})
export default class TweetBuff extends Model<TweetBuff> {

    @AllowNull(false)
    @Column
    tweet_id: String;

    @AllowNull(false)
    @Column
    date: Date;

}