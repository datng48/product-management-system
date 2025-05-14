import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    
    const user = this.userRepository.create({
      username,
      password: await bcrypt.hash(password, 10),
    });
    
    await this.userRepository.save(user);
    
    return {
      message: 'User registered successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { userId: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
} 