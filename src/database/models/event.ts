import {Table, Column, Model, ForeignKey, BelongsTo, HasOne, AllowNull} from 'sequelize-typescript';
import Company from "./company";
import Activity from "./activity";
import Tweet from "./tweet";

@Table({
    timestamps: false
})
export default class Event extends Model<Event> {

    @AllowNull(false)
    @Column
    created_date: Date;

    @AllowNull(false)
    @Column
    type: string;

    @AllowNull(false)
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;

    @HasOne(() => Activity)
    activity: Activity;

    @HasOne(() => Tweet)
    tweet: Tweet;
}