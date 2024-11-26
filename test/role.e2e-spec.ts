import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AdminCred } from './test-credential';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const body: Partial<Role> = {
    name: 'Test',
    permission: ['Admin', 'Editer'],
  };
  let doc: Role;
  let auth: {
    token: string;
    token_expiry: string;
    refresh_token: string;
    user: User;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('autheticate as user', () => {
    it('/auth/login (login and get token)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(AdminCred)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data);
          expect(response.body.data.token);
          expect(response.body.data.token_expiry);
          expect(response.body.data.refresh_token);
          expect(response.body.data.user);
          expect(response.body.data.user.id);
          expect(response.body.data.user.role_id);
          expect(response.body.data.user.email).toEqual(AdminCred.username);
          expect(response.body.data.user.password).toBeUndefined();
          auth = response.body.data;
        });
    });
  });

  describe('CRUD of role', () => {

    it('/role (Create)', () => {
      return request(app.getHttpServer())
        .post('/role')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          doc = response.body
        })
    });

    it('/role (getAll)', () => {
      return request(app.getHttpServer())
        .get('/role')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.rows)).toBeTruthy();
          expect(typeof response.body.count).toBe('number');
        });
    });

    it('/role/:uid (Update)', () => {
      return request(app.getHttpServer())
        .put('/role/' + doc.uid)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send({ name: 'tets1223' })
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('/role/:uid (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/role/' + doc.uid)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
