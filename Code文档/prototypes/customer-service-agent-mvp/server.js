const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createCustomerServiceAgent } = require("./agent-core");

const DEFAULT_PORT = 4175;
const PUBLIC_DIR = path.resolve(__dirname, "public");
const KNOWLEDGE_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "Agent研究文档",
  "Dify模板",
  "智能客服业务智能体",
  "knowledge-base-ai-agent-service-sales.md"
);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function createServer(options = {}) {
  const publicDir = options.publicDir || PUBLIC_DIR;
  const knowledgePath = options.knowledgePath || KNOWLEDGE_PATH;
  const sessions = new Map();

  return http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/api/health") {
        return sendJson(res, 200, {
          ok: true,
          product: "customer-service-agent-mvp",
          knowledge: path.basename(knowledgePath),
        });
      }

      if (req.method === "POST" && req.url === "/api/chat") {
        const body = await readJson(req);
        const sessionId = String(body.sessionId || "default");
        const message = String(body.message || "").trim();

        if (!message) {
          return sendJson(res, 400, {
            error: "message is required",
          });
        }

        if (!sessions.has(sessionId)) {
          sessions.set(sessionId, createCustomerServiceAgent({ knowledgePath }));
        }

        const agent = sessions.get(sessionId);
        return sendJson(res, 200, {
          sessionId,
          response: agent.reply(message),
          state: agent.getState(),
        });
      }

      if (req.method === "GET") {
        if (req.url === "/favicon.ico") {
          res.writeHead(204);
          return res.end();
        }
        return serveStatic(req, res, publicDir);
      }

      return sendJson(res, 405, { error: "method not allowed" });
    } catch (error) {
      return sendJson(res, 500, {
        error: "internal error",
        detail: error.message,
      });
    }
  });
}

function serveStatic(req, res, publicDir) {
  const requestPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = path.resolve(publicDir, relativePath);

  if (!filePath.startsWith(publicDir)) {
    return sendText(res, 403, "Forbidden");
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return sendText(res, 404, "Not Found");
  }

  const extname = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": contentTypes[extname] || "application/octet-stream",
  });
  return fs.createReadStream(filePath).pipe(res);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end(text);
}

function listenWithFallback(server, preferredPort = DEFAULT_PORT, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    let port = preferredPort;

    function tryListen() {
      server.once("error", onError);
      server.listen(port, host, () => {
        server.off("error", onError);
        resolve({ port, host });
      });
    }

    function onError(error) {
      server.off("error", onError);
      if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
        port += 1;
        tryListen();
        return;
      }
      reject(error);
    }

    tryListen();
  });
}

if (require.main === module) {
  const requestedPort = Number(process.env.PORT || DEFAULT_PORT);
  const server = createServer();
  listenWithFallback(server, requestedPort)
    .then(({ host, port }) => {
      console.log(`Customer service agent MVP listening at http://${host}:${port}`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = {
  createServer,
  listenWithFallback,
};
