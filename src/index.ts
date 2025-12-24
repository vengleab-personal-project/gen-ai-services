import { env } from "./env.js";
import app from "./server";

const port = env.PORT;
app.listen(port, () => {
  console.log(`[genai-service] listening on : http://localhost:${port}`);
});
