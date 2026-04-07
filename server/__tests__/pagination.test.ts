import app from "../src/app";
import request from "supertest";

describe("pagination defaults", () => {
  it("returns meta with page/limit", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBeDefined();
  });
});
