import arcjet, { tokenBucket } from "@arcjet/next";


console.log("ARCJET_KEY:", process.env.ARCJET_KEY); // 👈 this line stays


export const aj = arcjet({
  key: process.env.ARCJET_KEY ,
  
  // Create a token bucket rate limit. Other algorithms are supported.
  rules: [
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      characteristics: ["userId"], // track requests by a custom user ID
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
  ],
});