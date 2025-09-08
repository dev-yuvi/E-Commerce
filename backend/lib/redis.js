import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis("rediss://default:AfQXAAIncDEzOWNkZGU2ODY3NWY0YjIyYjU2NTkyZTFmYjRkYTdlMnAxNjI0ODc@smiling-collie-62487.upstash.io:6379");



