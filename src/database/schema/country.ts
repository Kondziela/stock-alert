import {Table, Column, Model, HasMany} from 'sequelize-typescript';

@Table
export default class Country extends Model<Country> {

    @Column
    country: string;

    @Column
    active: boolean;
    //
    // @HasMany(() => Company)
    // companies: Company[];

}