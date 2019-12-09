import {Table, Column, Model, ForeignKey, NotNull, BelongsTo} from 'sequelize-typescript';
import Price from "./price";
import Event from "./event";

@Table({
    timestamps: false
})
export default class Activity extends Model<Activity> {

    @NotNull
    @Column
    type: string;

    @NotNull
    @ForeignKey(() => Event)
    @Column
    event_id: number;

    @BelongsTo(() => Event)
    event: Event;

    @NotNull
    @ForeignKey(() => Price)
    @Column
    price_id: number;

    @BelongsTo(() => Price)
    price: Price;
}