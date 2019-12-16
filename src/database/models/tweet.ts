import {Table, Column, Model, ForeignKey, BelongsTo, AllowNull} from 'sequelize-typescript';
import Event from "./event";
import Company from "./company";

@Table({
    timestamps: false
})
export default class Tweet extends Model<Tweet> {

    @AllowNull(false)
    @Column
    total: number;

    @AllowNull(false)
    @Column
    date: Date;

    @AllowNull(false)
    @Column
    positive: number;

    @AllowNull(false)
    @Column
    negative: number;

    @AllowNull(false)
    @Column
    neutral: number;

    @AllowNull(true)
    @ForeignKey(() => Event)
    @Column
    event_id: number;

    @BelongsTo(() => Event)
    event: Event;

    @AllowNull(false)
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;
}