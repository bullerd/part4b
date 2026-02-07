const { test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const logger = require("../utils/logger");
const app = require("../app");

const api = supertest(app);

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  response = await api.get("/api/notes");
  logger.info(response.body);

  assert.strictEqual(response.body.length, 2);
});

test("a specific note is returned", async () => {
  response = await api.get("/api/notes");
  const contents = response.body.map((e) => e.content);

  assert.strictEqual(
    contents.includes("Buller's MongoDB lesson 12/14/25"),
    true,
  );
});
after(async () => {
  await mongoose.connection.close();
});
