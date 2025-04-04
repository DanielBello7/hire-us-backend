import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PassportLocalStrategy } from './strategies/passport-local.strategy';
import { AdminsModule } from 'src/admins/admins.module';
import { PersonModule } from 'src/person/person.module';
import { CompanyModule } from 'src/company/company.module';
import { PassportJWTStrategy } from './strategies/jwt.strategy';

@Module({
    providers: [AuthService, PassportLocalStrategy, PassportJWTStrategy],
    controllers: [AuthController],
    imports: [
        AccountsModule,
        CompanyModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AdminsModule,
        PersonModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET as string,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES as string,
            },
        }),
    ],
})
export class AuthModule {}
