import {Table, Column, Model, ForeignKey, BelongsTo, AllowNull} from 'sequelize-typescript';
import Company from "./company";

@Table({
    timestamps: false
})
export default class Hashtag extends Model<Hashtag> {

    @AllowNull(false)
    @Column
    hashtag: string;

    @AllowNull(false)
    @Column
    type: string;

    @AllowNull(false)
    @ForeignKey(() => Company)
    @Column
    company_id: number;

    @BelongsTo(() => Company)
    company: Company;
}