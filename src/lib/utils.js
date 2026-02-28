import connection from "../config/connectDB.js";
async function safeExecute(sql, params = []) {
  try {
    return await connection.execute(sql, params);
  } catch (err) {
    console.error("\nSQL ERROR");
    console.error("Query:", sql);

    console.error("Params:");
    params.forEach((p, i) => {
      console.error(`  $${i + 1}:`, p, `(${typeof p})`);
    });

    console.error("Error:", err.message);
    console.error("");
    throw err;
  }
}
export { safeExecute };
