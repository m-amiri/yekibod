const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/generate', require('./routes/generate'));
app.use('/history', require('./routes/history'));
app.use('/rating', require('./routes/rating'));
app.use('/storyEnhancer', require('./routes/storyEnhancer'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
