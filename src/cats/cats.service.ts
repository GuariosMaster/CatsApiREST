import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: ActiveUserInterface) {
   
    const breed = await this.validateBreed(createCatDto.breed)

    const cat = this.catsRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
      breed: breed,
      userEmail: user.email,
    });
    return await this.catsRepository.save(cat);
  }
  private async validateBreed(breed: string) {
    const breedEntity = await this.breedsRepository.findOneBy({ name: breed });
  
    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }
  
    return breedEntity;
  }

  async findAll(user: ActiveUserInterface) {
    if(user.role === Role.ADMIN){
      return await this.catsRepository.find();
    }
    return await this.catsRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: ActiveUserInterface) {
    const cat =  await this.catsRepository.findOneBy({ id });

    if(!cat){
      throw new BadRequestException('Cat not found');
    }
    
    this.validateOwnership(cat, user);

    return cat;
  }
  private validateOwnership(cat: Cat, user: ActiveUserInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: ActiveUserInterface) {
    await this.findOne(id, user);

    return await this.catsRepository.save({
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: ActiveUserInterface) {
    await this.findOne(id, user);
    return await this.catsRepository.softDelete(id);
  }
}
