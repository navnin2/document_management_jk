import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AdminCred } from './test-credential';
import { User } from 'src/modules/user/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const body: Partial<User> = {
    role_id: 2,
    full_name: 'Test',
    email: 'edit@mailinator.com',
    password: '123456',
  };
  let doc: User;
  let auth: {
    token: string;
    token_expiry: string;
    refresh_token: string;
    user: User;
    session_id: string;
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
          doc = response.body.data.user;
        });
    });
  });

  describe('CRUD of USER', () => {
    it('/user (getAll)', () => {
      return request(app.getHttpServer())
        .get('/user')
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.rows)).toBeTruthy();
          expect(typeof response.body.count).toBe('number');
        });
    });

    it('/user (Create)', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('/user/:uid (Update)', () => {
      return request(app.getHttpServer())
        .put('/user/' + doc.uid)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${auth.token}` })
        .send({ full_name: 'tets1223' })
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('/user/:uid (Delete)', () => {
      return request(app.getHttpServer())
        .delete('/user/' + doc.uid)
        .set({ Authorization: `Bearer ${auth.token}` })
        .expect(200);
    });
  });

  // describe('logout', () => {
  //   it('/auth/logout (logout)', () => {
  //     return request(app.getHttpServer())
  //       .post('/auth/logout')
  //       .set('Accept', 'application/json')
  //       .set({ Authorization: `Bearer ${auth.token}` })
  //       .send({ session_id: auth.session_id })
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then((res) => {
  //         console.log(res);
  //       });
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
