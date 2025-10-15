import request from "supertest";
import app from "../src/app";

describe("Not found", () => {
    it("GET /unknown -> 404", async () => {
        const res = await request(app).get("/__does_not_exist__");
        expect(res.status).toBe(404);
    });
});
