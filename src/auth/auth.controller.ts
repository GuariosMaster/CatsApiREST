import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Get, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./guard/auth/auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guard/roles.guard";
import { Role } from "../common/enums/role.enum";
import { Auth } from "./decorators/auth.decorators";
import { ActiveUser } from "../common/decorators/active-user.decorator";
import { ActiveUserInterface } from "src/common/interfaces/active-user.interface";
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post("register")
    register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post("login")
    login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }

    @Get('profile')
    @Auth(Role.ADMIN)
    profile(@ActiveUser() user: ActiveUserInterface) {
      console.log(user)
      return this.authService.profile(user);
    }
}
