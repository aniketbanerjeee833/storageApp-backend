// import { createClient } from "redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
//   username: "default",
//   password:"3BhQlk79DHByHWOxqUckyVvGVGhe1gqa"
// });

// redisClient.on("error", (err) => {
//   console.log("Redis Client Error", err);
//   process.exit(1);
// });

// await redisClient.connect();

// export default redisClient;

// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: '3BhQlk79DHByHWOxqUckyVvGVGhe1gqa',
//     socket: {
//         host: 'sky-design-mahogany-47567.db.redis.io',
//         port: 18081
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

