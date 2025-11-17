const app = require("./app");
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ BakeBuddy server running on http://localhost:${PORT}`);
});