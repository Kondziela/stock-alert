import {Table, Column, Model, HasMany, AllowNull} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Country extends Model<Country> {

    @AllowNull(false)
    @Column
    country: string;

    @AllowNull(false)
    @Column
    active: boolean;

    @HasMany(() => Company)
    companies: Company[];

}