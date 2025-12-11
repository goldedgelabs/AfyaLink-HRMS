import Redis from "ioredis";

let redis;

if (process.env.UPSTASH_REDIS_URL) {
  redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    tls: process.env.UPSTASH_REDIS_URL.startsWith("rediss://")
      ? {}
      : undefined,
  });

  redis.on("connect", () => console.log("Redis connected (Upstash)"));
  redis.on("error", (err) => console.error("Redis error", err));
} else {
  console.log("⚠️ UPSTASH_REDIS_URL not found — Redis disabled");
}

export default redis;
