import {Table, Column, Model, ForeignKey, NotNull, BelongsTo, HasMany} from 'sequelize-typescript';
import Country from "./country";
import Hashtag from "./hashtag";
import Price from "./price";
import Event from "./event";

@Table({
    timestamps: false
})
export default class Company extends Model<Company> {

    @NotNull
    @Column
    code: string;

    @NotNull
    @Column
    name: string;

    @NotNull
    @ForeignKey(() => Country)
    @Column
    country_id: number;

    @BelongsTo(() => Country)
    country: Country;

    @HasMany(() => Hashtag)
    hashtags: Hashtag[];

    @HasMany(() => Price)
    prices: Price[];

    @HasMany(() => Event)
    events: Event[];

}