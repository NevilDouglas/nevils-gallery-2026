/**
 * Eenvoudige smoke/integration test.
 *
 * Doel:
 * - controleren of de backendbasis werkt
 * - controleren of de server een rootresponse geeft
 *
 * Let op:
 * Hiervoor moet de Express-app exporteerbaar zijn.
 * Als index.js nu alleen luistert met app.listen, dan moeten we dat iets netter splitsen.
 */

const request = require("supertest");
const express = require("express");

describe("Smoke test", () => {
  test("dummy test zodat Jest direct werkt", () => {
    expect(true).toBe(true);
  });

  test("example express app responds", async () => {
    const app = express();

    app.get("/", (_req, res) => {
      res.status(200).send("API running...");
    });

    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API running...");
  });
});