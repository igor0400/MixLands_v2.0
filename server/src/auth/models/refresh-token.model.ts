import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_revoked: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  user_ip: string;

  @Column({ type: DataType.STRING, allowNull: false })
  user_agent: string;
}
