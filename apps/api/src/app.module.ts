import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './modules/auth/auth.controller';
import { UsersController } from './modules/users/users.controller';
import { ChallengesController } from './modules/challenges/challenges.controller';
import { PrsController } from './modules/prs/prs.controller';
import { LeaderboardController } from './modules/leaderboard/leaderboard.controller';
import { WalletController } from './modules/wallet/wallet.controller';
import { ToolsController } from './modules/tools/tools.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    AuthController,
    UsersController,
    ChallengesController,
    PrsController,
    LeaderboardController,
    WalletController,
    ToolsController
  ],
  providers: [],
})
export class AppModule {}