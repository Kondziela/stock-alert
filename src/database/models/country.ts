import {Table, Column, Model, HasMany} from 'sequelize-typescript';

@Table({
    timestamps: false
})
export default class Country extends Model<Country> {

    @Column
    country: string;

    @Column
    active: boolean;
    //
    // @HasMany(() => Company)
    // companies: Company[];

}