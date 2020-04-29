const Koa = require('koa')
const app = new Koa()

const router = require('koa-router')

// 1--2--3--4--5

app.use(async (ctx, next)=> {
  console.log('1')
  await next()

  console.log('5');
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} ${rt}`);
})

app.use(async (ctx, next)=> {
  console.log('2');
  const start = Date.now()
  await next()

  console.log('4');
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);

})

app.use(async ctx=> {
  console.log('3---');
  ctx.body = 'hi'
})

app.listen(3000, ()=> {
  console.log('监听 3000 port');
})