import { env } from "./env.js";
import app from "./index.js";

const port = env.PORT;
app.listen(port, () => {
  console.log(`[genai-service] listening on : http://localhost:${port}`);
});
