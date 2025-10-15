import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.post("/echo", (req, res) => {
    res.status(201).json({ received: req.body });
});
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
export default app;