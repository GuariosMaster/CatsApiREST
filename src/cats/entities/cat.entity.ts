import { Breed } from "../../breeds/entities/breed.entity";
import {
    Column,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { JoinColumn } from "typeorm";

@Entity()
export class Cat {
  

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    age: number; 
  
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Breed, (breed) => breed.id, {
      eager: true,
    })
    breed: Breed;

    @Column()
    userEmail: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email',})
    user: User;
}
