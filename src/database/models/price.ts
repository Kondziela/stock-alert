import {Table, Column, Model, ForeignKey, BelongsTo, AllowNull} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Price extends Model<Price> {

    @AllowNull(false)
    @Column
    open: number;

    @AllowNull(false)
    @Column
    close: number;

    @AllowNull(false)
    @Column
    max: number;

    @AllowNull(false)
    @Column
    min: number;

    @AllowNull(false)
    @Column
    volume: number;

    @AllowNull(false)
    @Column
    date: Date;

    @AllowNull(false)
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;

}