import test from 'ava';
import { agent } from 'supertest';

test('server', async t => {
  const server = require('../examples/server')();
  const req = agent(server);

  const res0 = await req.get('/');
  t.true(res0.statusCode === 404);

  const res1 = await req.get('/db/test-db');
  t.true(res1.statusCode === 200);
  t.true(res1.body.db_name === 'test-db');
});

test('server', async t => {
  const server = require('../examples/single-db')();
  const req = agent(server);

  const res0 = await req.get('/');
  t.true(res0.statusCode === 404);

  const res1 = await req.get('/db/test-db');
  t.true(res1.statusCode === 404);

  const res2 = await req.get('/db1');
  t.true(res2.statusCode === 200);
  t.true(res2.body.db_name === '/tmp/db');
});
