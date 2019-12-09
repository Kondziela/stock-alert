import {Table, Column, Model, ForeignKey, NotNull, BelongsTo} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Price extends Model<Price> {

    @NotNull
    @Column
    open: number;

    @NotNull
    @Column
    close: number;

    @NotNull
    @Column
    max: number;

    @NotNull
    @Column
    min: number;

    @NotNull
    @Column
    volume: number;

    @NotNull
    @Column
    date: Date;

    @NotNull
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;

}