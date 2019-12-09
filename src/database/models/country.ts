import {Table, Column, Model, HasMany, NotNull} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Country extends Model<Country> {

    @NotNull
    @Column
    country: string;

    @NotNull
    @Column
    active: boolean;

    @HasMany(() => Company)
    companies: Company[];

}