import express from "express";
const app = express();
const PORT = 8080;
app.use(express.static("public"));
const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
