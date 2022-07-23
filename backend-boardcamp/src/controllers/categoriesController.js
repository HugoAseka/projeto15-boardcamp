import connection from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getCategories(req, res) {
  const { rows: categories } = await connection.query(
    "SELECT * FROM categories"
  );
  res.send(categories);
}

export async function insertCategory(req, res) {
  const newCategory = req.body;
  const { rows: categories } = await connection
    .query("SELECT (name) FROM categories")
  
  for( let i = 0 ; i < categories.length ; i++){
    if( categories[i].name === newCategory.name ) return res.status(409).send("Categoria já criada");
  }

  const categorySchema = joi.object({ name: joi.string().required() });

  const { error } = categorySchema.validate(newCategory);

  if (error) {
    return res.sendStatus(400);
  }

  await connection.query("INSERT INTO categories (name) VALUES ($1)", [
    newCategory.name,
  ]);

  res.sendStatus(201);
}
