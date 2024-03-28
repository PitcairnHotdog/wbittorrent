import 'dotenv/config'
import { createConnection } from "mongoose"

const url = process.env.MONGODB_URI;
export const DBConnection = createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });