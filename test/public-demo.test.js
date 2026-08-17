const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { isPublicWriteAccessEnabled } = require("../config/publicDemo.js");

function collectTemplates(directory, templates = []) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) collectTemplates(fullPath, templates);
        else if (entry.name.endsWith(".ejs")) templates.push(fullPath);
    }
    return templates;
}

test("production deployment is read-only by default", () => {
    assert.equal(isPublicWriteAccessEnabled(), false);
    assert.equal(isPublicWriteAccessEnabled({ configuredValue: "false" }), false);
});

test("write access requires an exact explicit opt-in", () => {
    assert.equal(isPublicWriteAccessEnabled({ configuredValue: "true" }), true);
    assert.equal(isPublicWriteAccessEnabled({ configuredValue: "TRUE" }), false);
});

test("write access remains fail-closed outside production", () => {
    assert.equal(isPublicWriteAccessEnabled(), false);
    assert.equal(isPublicWriteAccessEnabled({ configuredValue: "false" }), false);
    assert.equal(isPublicWriteAccessEnabled({ configuredValue: "true" }), true);
});

test("public templates contain no third-party travel brand wording", () => {
    const templates = collectTemplates(path.join(__dirname, "..", "views"));
    for (const templatePath of templates) {
        const source = fs.readFileSync(templatePath, "utf8");
        assert.doesNotMatch(source, /airbnb/i, templatePath);
    }
});

test("all public templates avoid inline scripts and styles", () => {
    const templates = collectTemplates(path.join(__dirname, "..", "views"));
    for (const templatePath of templates) {
        const source = fs.readFileSync(templatePath, "utf8");
        assert.doesNotMatch(source, /<script(?![^>]*\bsrc=)[^>]*>/i, templatePath);
        assert.doesNotMatch(source, /<style\b/i, templatePath);
        assert.doesNotMatch(source, /\sstyle=/i, templatePath);
    }
});
