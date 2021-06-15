const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body')
const { v4: uuidv4 } = require('uuid');
const Router = require("koa-router");
const cors = require('@koa/cors');
const faker = require('faker');

const app = new Koa();

const data = {
    "status": "ok",
    "timestamp": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
    "messages": []
  }

function getMessages() {
  data.messages.push({
    "id": uuidv4(),
    "from": faker.internet.email(),
    "subject": faker.lorem.words(3),
    "body": faker.lorem.words(10),
    "received": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
  })
}

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

const router = new Router();

app.use(async (ctx, next) => {

  const { method, url } = ctx.request;

  if ( method === 'GET' && url === '/messages/unread' ) {
    ctx.response.status = 200;
    getMessages();
    ctx.response.body = data;
  } else {
    ctx.response.status = 204;
  }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
server.listen( port , () => console.log('server started'));