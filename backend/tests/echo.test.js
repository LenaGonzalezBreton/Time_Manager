import request from "supertest";
import app from "../src/app";
describe("JSON parsing", () => {
    it("POST /echo -> 201 and echoes body", async () => {
        const payload = { hello: "world" };
        const res = await request(app).post("/echo").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ received: payload });
    });
});
//# sourceMappingURL=echo.test.js.map