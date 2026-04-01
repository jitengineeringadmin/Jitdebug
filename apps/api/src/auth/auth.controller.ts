import { Controller, Post, Body, Get, UseGuards, Request, Response, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Response({ passthrough: true }) res: any) {
    const { accessToken, refreshToken, user } = await this.authService.login(body.email, body.password);
    
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    
    return user;
  }

  @Post('refresh')
  async refresh(@Request() req: any, @Response({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const tokens = await this.authService.refresh(refreshToken);
    
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    
    return { success: true };
  }

  @Post('logout')
  async logout(@Request() req: any, @Response({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refreshToken;
    await this.authService.logout(refreshToken);
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
