const { test, after, beforeEach, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const logger = require("../utils/logger");
const app = require("../app");
const Note = require("../models/note");

const api = supertest(app);

const initialNotes = [
  {
    content: "Buller's MongoDB lesson 12/14/25",
    important: false,
  },
  {
    content: "A second MongoDB record has been added",
    important: true,
  },
];

//From FSO
// beforeEach(async () => {
//   await Note.deleteMany({});
//   initialNotes.forEach(async (n) => {
//     const newNote = Note(n);
//     await newNote.save();
//   });
// });

//From Claude and me:
beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  response = await api.get("/api/notes");
  // logger.info(response.body);

  assert.strictEqual(response.body.length, initialNotes.length);
});

test("a specific note is returned", async () => {
  response = await api.get("/api/notes");
  const contents = response.body.map((e) => e.content);

  assert.strictEqual(
    contents.includes("Buller's MongoDB lesson 12/14/25"),
    true,
  );
  // could have simplified this the above to:
  // assert(contents.includes("Buller's MongoDB lesson 12/14/25"));
});

test("a valid note can be added ", async () => {
  const newNote = {
    content: "async/await makes this much easier",
    important: true,
  };
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);
  assert.strictEqual(response.body.length, initialNotes.length + 1);

  assert(contents.includes("async/await makes this much easier"));
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const response = await api.get("/api/notes");
  // console.log(response.body.map((n) => n.content));

  assert.strictEqual(response.body.length, initialNotes.length);
});

after(async () => {
  await mongoose.connection.close();
});
