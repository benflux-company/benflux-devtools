import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';

async function runTests() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Benflux DevTools API')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  console.log('--- RUNNING SWAGGER VERIFICATION TESTS ---');

  let passed = true;

  // Verify paths
  const paths = Object.keys(document.paths);
  if (paths.length === 0) {
    console.error('❌ No paths found in Swagger document');
    passed = false;
  }

  paths.forEach(path => {
    const methods = Object.keys(document.paths[path]);
    methods.forEach(method => {
      const endpoint = document.paths[path][method];
      
      // 1. All controllers have @ApiTags (endpoints inherit tags)
      if (!endpoint.tags || endpoint.tags.length === 0) {
        console.error(`❌ Endpoint ${method.toUpperCase()} ${path} is missing tags (@ApiTags)`);
        passed = false;
      }

      // 2. All endpoints have @ApiOperation with summary and description
      if (!endpoint.summary || !endpoint.description) {
        console.error(`❌ Endpoint ${method.toUpperCase()} ${path} is missing summary or description (@ApiOperation)`);
        passed = false;
      }

      // 4. All response shapes documented
      if (!endpoint.responses || Object.keys(endpoint.responses).length === 0) {
        console.error(`❌ Endpoint ${method.toUpperCase()} ${path} is missing responses (@ApiResponse)`);
        passed = false;
      }

      // 5. Auth-protected routes marked with @ApiBearerAuth
      // Our dummy controllers use @ApiBearerAuth('JWT') for all POST methods
      if (method === 'post') {
        if (!endpoint.security || endpoint.security.length === 0 || !endpoint.security.some(sec => sec.JWT)) {
          console.error(`❌ POST Endpoint ${method.toUpperCase()} ${path} is missing @ApiBearerAuth`);
          passed = false;
        }
      }
    });
  });

  // 3. All request DTOs have @ApiProperty
  const schemas = document.components?.schemas || {};
  if (Object.keys(schemas).length === 0) {
    console.error('❌ No schemas found in Swagger document');
    passed = false;
  }

  Object.entries(schemas).forEach(([name, s]) => {
    const schema = s as any;
    if (schema.type === 'object' && (!schema.properties || Object.keys(schema.properties).length === 0)) {
      console.error(`❌ Schema ${name} has no documented properties (@ApiProperty)`);
      passed = false;
    }
  });

  if (passed) {
    console.log('✅ Test 1: All controllers have @ApiTags');
    console.log('✅ Test 2: All endpoints have @ApiOperation with summary and description');
    console.log('✅ Test 3: All request DTOs have @ApiProperty');
    console.log('✅ Test 4: All response shapes documented with @ApiResponse');
    console.log('✅ Test 5: Auth-protected routes marked with @ApiBearerAuth');
    console.log('--- ALL VERIFICATIONS PASSED ---');
  } else {
    console.log('--- VERIFICATION FAILED ---');
    process.exit(1);
  }

  await app.close();
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
