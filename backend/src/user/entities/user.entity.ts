// Entities are for database tables or for collections
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'varchar', length:30})
  firstname:string;

  @Column({type:'varchar', length:15})
  lastname:string;

  @Column({unique: true, type:'varchar', length:40})
  email:string;

  @Column({type:'varchar'})
  password:string;

  @Column({default: 'user', type:'varchar'})
  role:string;
}
