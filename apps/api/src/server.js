import 'dotenv/config';
import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '5000', 10);
const app = createApp();

app.listen(port, () => {
  console.log(`SDAS API listening on port ${port}`);
});

