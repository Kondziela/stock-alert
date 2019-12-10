import {Table, Column, Model, ForeignKey, BelongsTo, HasMany, AllowNull} from 'sequelize-typescript';
import Country from "./country";
import Hashtag from "./hashtag";
import Price from "./price";
import Event from "./event";

@Table({
    timestamps: false
})
export default class Company extends Model<Company> {

    @AllowNull(false)
    @Column
    code: string;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
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