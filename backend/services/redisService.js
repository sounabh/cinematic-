import Redis from "ioredis"



const RedisClient  = new Redis({
   host:"redis-10619.c53.west-us.azure.redns.redis-cloud.com",
    port:"10619",
    password:"QJRzAPzlawORiesjYthevq0tYEHloS6B"
})

RedisClient.on("connect",() =>{

console.log("redis connected");


})

export default RedisClient