const app = require("./app");

const port = 3000 || process.env.PORT;


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});