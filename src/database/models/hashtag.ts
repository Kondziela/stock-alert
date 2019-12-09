import {Table, Column, Model, ForeignKey, NotNull, BelongsTo} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Hashtag extends Model<Hashtag> {

    @NotNull
    @Column
    hashtag: string;

    @NotNull
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;
}