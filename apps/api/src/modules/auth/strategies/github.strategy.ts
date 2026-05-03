import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('github.clientId'),
      clientSecret: configService.get<string>('github.clientSecret'),
      callbackURL: configService.get<string>('github.callbackUrl'),
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const githubUser = {
      githubId: String(profile.id),
      username: profile.username,
      email: profile.emails?.[0]?.value || null,
      avatarUrl: profile.photos?.[0]?.value || null,
      bio: profile._json?.bio || null,
      githubUrl: profile.profileUrl || null,
    };

    return this.authService.findOrCreateUser(githubUser);
  }
}
