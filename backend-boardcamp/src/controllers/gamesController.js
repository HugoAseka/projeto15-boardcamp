import connection from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getGames(req, res) {
  const name = req.query.name;

  const { rows: games } = await connection.query(
    `SELECT g.*, c.name as "categoryName" FROM games g JOIN categories c ON g."categoryId" = c.id`
  );

  //filter by queryString
  if (name) {
    const filteredByInitial = games.filter((obj) => {
      for (let i = 0; i < name.length; i++) {
        if (obj.name[i].toLowerCase() !== name[i].toLowerCase()) return false;
      }
      return true;
    });

    return res.send(filteredByInitial);
  }

  res.send(games);
}

export async function insertGame(req, res) {
  const newGame = req.body;
  const { rows: allGames } = await connection.query("SELECT * FROM games");
  const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().min(0).required(),
    categoryId: joi.number().min(0).required(),
    pricePerDay: joi.number().min(0).required(),
  });
  console.log(newGame);
  try {
    const { error } = gameSchema.validate(newGame);
    let nameAlreadyTaken = false;
    allGames.map((game) => {
      if( game.name === newGame.name) nameAlreadyTaken = true;
    });
    console.log(nameAlreadyTaken);

    if (nameAlreadyTaken) return res.sendStatus(409);
    else if (error) {
      return res.sendStatus(400);
    }

    await connection.query(
      `INSERT INTO games (name,image,"stockTotal", "categoryId", "pricePerDay" ) VALUES ($1,$2,$3, $4, $5)`,
      [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]
    );
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}
