import RedisClient from "../services/redisService.js";


const CACHE_TTL = 7*24*60*60; // 1 hour in seconds // 7 days


//redis setter cache func
async function cacheUser(userId, userData) {
  try {
  const res = await RedisClient.set(
      `user:${userId}`,
      JSON.stringify(userData),
      'EX',
      CACHE_TTL
    );
    
    return res
  
    
  } catch (error) {
    console.error('Redis cache error:', error);
  }
}



async function getCachedUser(userId) {
  try {
    const cachedUser = await RedisClient.get(`user:${userId}`);
    return cachedUser ? JSON.parse(cachedUser) : null;
  } catch (error) {
    console.error('Redis cache error:', error);
    return null;
  }
}



async function invalidateUserCache(userId) {
  try {
    await RedisClient.del(`user:${userId}`);
  } catch (error) {
    console.error('Redis cache error:', error);
  }
}



export {invalidateUserCache,getCachedUser,cacheUser}