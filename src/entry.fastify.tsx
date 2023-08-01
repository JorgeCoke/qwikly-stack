/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Fastify server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/docs/deployments/node/
 *
 */
import { type PlatformNode } from "@builder.io/qwik-city/middleware/node";
import Fastify from "fastify";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { stripe } from "./lib/stripe";
import FastifyQwik from "./plugins/fastify-qwik";
import { webhookHandler } from "./routes/payments/webhooks/handler";

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), "..", "..", "dist");
const buildDir = join(distDir, "build");

// Allow for dynamic port
const PORT = parseInt(process.env.PORT ?? "3000");

const start = async () => {
  // Create the fastify server
  // https://www.fastify.io/docs/latest/Guides/Getting-Started/
  const fastify = Fastify({
    logger: false,
  });

  // Enable compression
  // https://github.com/fastify/fastify-compress
  // IMPORTANT NOTE: THIS MUST BE REGISTERED BEFORE THE fastify-qwik PLUGIN
  // await fastify.register(import('@fastify/compress'))

  // Handle Qwik City using a plugin
  await fastify.register(FastifyQwik, { distDir, buildDir });

  // NOTE: We need the raw body from the request
  await fastify.register(import("fastify-raw-body"), {
    global: false,
    encoding: false,
    runFirst: true,
  });

  fastify.post(
    "/payments/webhooks",
    { config: { rawBody: true } },
    async function (request, reply) {
      const stripeEvent = stripe.webhooks.constructEvent(
        request.rawBody as Buffer,
        request.headers["stripe-signature"]!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      const result = await webhookHandler(stripeEvent);
      reply.status(200).send(result);
    }
  );

  // Start the fastify server
  // NOTE: See https://fastify.dev/docs/latest/Guides/Getting-Started/#note
  await fastify.listen({ host: "::", port: PORT });
};

start();
