const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");

process.env.NODE_ENV = "production";
process.env.PUBLIC_WRITE_ACCESS = "false";
process.env.PORT = "0";
delete process.env.ATLASDB_URL;
delete process.env.SECRET;

const { start } = require("../app");


test("read-only runtime starts without database or session credentials", async (t) => {
    const server = await start();
    if (!server.listening) await once(server, "listening");

    t.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    }));

    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const catalogueResponse = await fetch(`${baseUrl}/listings`);
    const catalogue = await catalogueResponse.text();

    assert.equal(catalogueResponse.status, 200);
    assert.match(catalogue, /Shoreditch Design Studio/);
    assert.equal(catalogueResponse.headers.get("set-cookie"), null);

    for (const path of ["/signup", "/login", "/listings/new"]) {
        const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
        assert.equal(response.status, 403, path);
    }

    for (const path of ["/signup", "/login", "/logout", "/listings"]) {
        const response = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            redirect: "manual",
        });
        assert.equal(response.status, 403, path);
    }
});
