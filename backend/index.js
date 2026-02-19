const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// ------------------------
// Users Endpoints
// ------------------------
app.get("/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ------------------------
// Categories Endpoints
// ------------------------
app.get("/categories", async (req, res) => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/categories", async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from("categories").insert([{ name }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ------------------------
// Todos Endpoints
// ------------------------
app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/todos", async (req, res) => {
  const { task, user_id, priority, due_date, category_id } = req.body;
  const { data, error } = await supabase.from("todos").insert([
    {
      task,
      user_id,
      priority,
      due_date,
      category_id,
    },
  ]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed, priority, due_date, category_id } = req.body;

  const { data, error } = await supabase
    .from("todos")
    .update({ task, completed, priority, due_date, category_id })
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("todos").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
