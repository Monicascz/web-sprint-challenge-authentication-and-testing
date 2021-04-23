const request = require('supertest');
const db = require('../data/dbConfig.js');
const Server = require('./server.js');
const bcrypt = require('bcryptjs');


const newUser = { id: 1, username: "1user", password: "1234" };

test('sanity', () => {
  expect(true).not.toBe(false);
});



beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('server', () => {
  describe('[GET] /jokes ', () => {
    it("throws back 401 if user does not login", async () => {
      const res = await request(Server).get("/api/jokes");
      expect(res.status).toEqual(401);
    });

  });
  describe('[POST] api/auth/register ', () => {
    it("responds with 201 when username and password are properly set-up", async () => {

      const res = await request(Server).post("/api/auth/register").send(newUser);
      expect(res.status).toEqual(201);
    });
    it("saves the user with a bcrypted password instead of plain text", async () => {

      await request(Server).post('/api/auth/register').send(newUser);
      const oneUser = await db('users').where('username', '1user').first();
      expect(bcrypt.compareSync('1234', oneUser.password)).toBeTruthy();
    });

  });
});

