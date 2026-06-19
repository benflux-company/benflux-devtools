const fs = require('fs');
const path = require('path');

const modules = [
  'auth', 'users', 'challenges', 'prs', 'leaderboard', 'wallet', 'tools'
];

const srcDir = path.join(__dirname, 'src', 'modules');

if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

const appModuleImports = [];
const appModuleControllers = [];

modules.forEach(mod => {
  const modDir = path.join(srcDir, mod);
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir);
  
  const dtoDir = path.join(modDir, 'dto');
  if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir);

  const className = mod.charAt(0).toUpperCase() + mod.slice(1) + 'Controller';
  
  // Create dummy DTOs
  fs.writeFileSync(path.join(dtoDir, `create-${mod}.dto.ts`), `
import { ApiProperty } from '@nestjs/swagger';

export class Create${mod.charAt(0).toUpperCase() + mod.slice(1)}Dto {
  @ApiProperty({ description: 'The identifier', example: '123' })
  id: string;
}
  `.trim());

  // Create Controller
  const controllerContent = `
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Create${mod.charAt(0).toUpperCase() + mod.slice(1)}Dto } from './dto/create-${mod}.dto';

@ApiTags('${mod}')
@Controller('${mod}')
export class ${className} {
  @Get()
  @ApiOperation({ summary: 'Get all ${mod}', description: 'Retrieve a list of ${mod}' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return [];
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new ${mod}', description: 'Creates a new ${mod} entry' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: Create${mod.charAt(0).toUpperCase() + mod.slice(1)}Dto) {
    return { success: true };
  }
}
  `.trim();

  fs.writeFileSync(path.join(modDir, `${mod}.controller.ts`), controllerContent);
  
  appModuleImports.push(`import { ${className} } from './modules/${mod}/${mod}.controller';`);
  appModuleControllers.push(className);
});

const appModuleContent = `
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
${appModuleImports.join('\n')}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    ${appModuleControllers.join(',\n    ')}
  ],
  providers: [],
})
export class AppModule {}
`.trim();

fs.writeFileSync(path.join(__dirname, 'src', 'app.module.ts'), appModuleContent);
console.log('Generated controllers, DTOs, and app.module.ts');
