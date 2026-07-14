// eduNext webcam-recording backend — Node.js (no external deps).
// Port 5000. Saves student webcam .webm blobs to backend/uploads/students/.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = 5000;
const ROOT = path.join(__dirname, "uploads", "students");
fs.mkdirSync(ROOT, { recursive: true });

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function listStudentDirs() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

const server = http.createServer((req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/^\/api\/uploads/, "") || "/";

  // GET /next-student-id  -> { studentFolder: "Student-N" }
  if (req.method === "GET" && pathname === "/next-student-id") {
    const dirs = listStudentDirs();
    const nums = dirs
      .map((d) => parseInt((d.match(/Student-(\d+)/) || [])[1] || "0", 10))
      .filter((n) => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ studentFolder: `Student-${next}`, id: next }));
  }

  // POST /upload?student=Student-X&filename=Y.webm
  if (req.method === "POST" && pathname === "/upload") {
    const student = (url.searchParams.get("student") || "Student-1").replace(/[^A-Za-z0-9_-]/g, "");
    const filename = (url.searchParams.get("filename") || `rec-${Date.now()}.webm`).replace(/[^A-Za-z0-9_.-]/g, "");
    const dir = path.join(ROOT, student);
    fs.mkdirSync(dir, { recursive: true });
    const out = fs.createWriteStream(path.join(dir, filename));
    req.pipe(out);
    out.on("finish", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, student, filename }));
    });
    out.on("error", (e) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(e) }));
    });
    return;
  }

  // GET /recordings/:student -> list of files
  const recMatch = pathname.match(/^\/recordings\/([^/]+)$/);
  if (req.method === "GET" && recMatch) {
    const student = recMatch[1].replace(/[^A-Za-z0-9_-]/g, "");
    const dir = path.join(ROOT, student);
    let files = [];
    if (fs.existsSync(dir)) {
      files = fs.readdirSync(dir).filter((f) => f.endsWith(".webm"));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ student, files }));
  }

  // GET /recordings -> all students + counts
  if (req.method === "GET" && pathname === "/recordings") {
    const data = listStudentDirs().map((s) => ({
      student: s,
      files: fs.readdirSync(path.join(ROOT, s)).filter((f) => f.endsWith(".webm")),
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data));
  }

  // GET /video/:student/:filename -> stream a recording
  const vidMatch = pathname.match(/^\/video\/([^/]+)\/([^/]+)$/);
  if (req.method === "GET" && vidMatch) {
    const file = path.join(ROOT, vidMatch[1].replace(/[^A-Za-z0-9_-]/g, ""), vidMatch[2].replace(/[^A-Za-z0-9_.-]/g, ""));
    if (fs.existsSync(file)) {
      res.writeHead(200, { "Content-Type": "video/webm" });
      return fs.createReadStream(file).pipe(res);
    }
    res.writeHead(404);
    return res.end("not found");
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log(`[eduNext] webcam upload server on http://localhost:${PORT}`);
  console.log(`[eduNext] recordings stored in ${ROOT}`);
});
