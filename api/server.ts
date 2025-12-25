
import app from "./src/app.js";
import { ENV } from "./src/config/env.js";
const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`server is running on: http://localhost:${PORT}`)
})