// Entities are for database tables or for collections
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Use UUID as the primary key
  user_id:string;

  @Column({type:'varchar', length:30})
  first_name:string;

  @Column({type:'varchar', length:15})
  last_name:string;

  @Column({unique: true, type:'varchar', length:40})
  email:string;

  @Column({type:'varchar'})
  password:string;

  @Column({default: 'user', type:'varchar'})
  role:string;
}
