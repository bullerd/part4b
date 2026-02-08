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
after(async () => {
  await mongoose.connection.close();
});
