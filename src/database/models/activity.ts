import {Table, Column, Model, ForeignKey, BelongsTo, AllowNull} from 'sequelize-typescript';
import Price from "./price";
import Event from "./event";

@Table({
    timestamps: false
})
export default class Activity extends Model<Activity> {

    @AllowNull(false)
    @Column
    type: string;

    @AllowNull(false)
    @ForeignKey(() => Event)
    @Column
    event_id: number;

    @BelongsTo(() => Event)
    event: Event;

    @AllowNull(false)
    @ForeignKey(() => Price)
    @Column
    price_id: number;

    @BelongsTo(() => Price)
    price: Price;
}