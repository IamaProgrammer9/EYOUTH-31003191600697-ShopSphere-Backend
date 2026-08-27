import app from './index.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Backend server started on url http://localhost:${port}`);
});
