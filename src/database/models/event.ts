import {Table, Column, Model, ForeignKey, NotNull, BelongsTo, HasOne} from 'sequelize-typescript';
import Company from "./company";
import Activity from "./activity";
import Tweet from "./tweet";

@Table({
    timestamps: false
})
export default class Event extends Model<Event> {

    @NotNull
    @Column
    created_date: Date;

    @NotNull
    @Column
    type: string;

    @NotNull
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