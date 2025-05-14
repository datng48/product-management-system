import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    
    this.logger.log(`JWT_SECRET from env: ${secret ? 'exists' : 'does not exist'}`);
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({ 
      where: { id: payload.userId }
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }
} 