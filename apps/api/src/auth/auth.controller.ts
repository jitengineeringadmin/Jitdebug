import { Controller, Post, Body, Get, UseGuards, Request, Response, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Response() res: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user);
    
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({
      access_token: result.access_token,
      user: result.user,
    });
  }

  @Post('refresh')
  async refresh(@Request() req: any, @Response() res: any) {
    const token = req.cookies?.refresh_token || req.body.refresh_token;
    if (!token) throw new UnauthorizedException();

    const result = await this.authService.refresh(token);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({
      access_token: result.access_token,
    });
  }

  @Post('logout')
  async logout(@Request() req: any, @Response() res: any) {
    const token = req.cookies?.refresh_token || req.body.refresh_token;
    if (token) {
      await this.authService.logout(token);
    }
    res.clearCookie('refresh_token');
    return res.send({ message: 'Logged out' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
