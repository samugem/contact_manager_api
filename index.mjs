import express from "express";
import "./loadEnv.mjs";
import "express-async-errors";
import contacts from "./routes/contacts.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());

// Load the /contacts routes
app.use("/contacts", contacts);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occured.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
