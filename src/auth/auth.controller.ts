import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR, USER_TO_DELETE_DOES_NOT_EXIST } from './auth.constants';
import { UserEmail } from '../decorators/user-email.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

// dto: data transfered object

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		const { email } = await this.authService.validateUser(login, password);
		return this.authService.login(email);
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	@Delete('')
	async deleteByEmail(@UserEmail() email: string) {
		const userToDelete = await this.authService.findUser(email);
		if (!userToDelete) {
			throw new BadRequestException(USER_TO_DELETE_DOES_NOT_EXIST);
		}
		return this.authService.delete(email);
	}

	@HttpCode(200)
	@Get('')
	async getAllUsers() {
		return this.authService.getAllUsers();
	}
}
