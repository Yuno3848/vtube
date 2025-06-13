import dotenv from "dotenv";
import cors from "cors";

import app from "./app.js";
import { db } from "./src/utils/index.js";

dotenv.config();
const corsHandler = {
  ORIGIN: process.env.BASE_ORIGIN || process.env.PORT,
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsHandler));
db()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database :", error);
    process.exit();
  });
