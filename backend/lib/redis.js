import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis("rediss://default:Ab3FAAIjcDE0NWI4NDIxN2FhZjM0ZmUzYjYyYTgwNmM3OTgzOGUzOXAxMA@pure-muskrat-48581.upstash.io:6379", {
  maxRetriesPerRequest: null,   // disable retry cap
  enableReadyCheck: false,      // skip cluster/role check
  tls: {},                      // required for `rediss://` secure connection
});

