import {Table, Column, Model, ForeignKey, NotNull, BelongsTo} from 'sequelize-typescript';
import Event from "./event";
import Company from "./company";

@Table({
    timestamps: false
})
export default class Tweet extends Model<Tweet> {

    @NotNull
    @Column
    total: number;

    @NotNull
    @Column
    date: Date;

    @NotNull
    @Column
    positive: number;

    @NotNull
    @Column
    negative: number;

    @NotNull
    @Column
    neutral: number;

    @NotNull
    @ForeignKey(() => Event)
    @Column
    event_id: number;

    @BelongsTo(() => Event)
    event: Event;

    @NotNull
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;
}