import connection from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getGames(req, res) {
  const { rows: games } = await connection.query("SELECT * FROM games");
  const { rows: allCategories } = await connection.query(
    "SELECT * FROM categories"
  );
  const name = req.query.name;

  //insert categoryName
  for (let i = 0; i < games.length; i++) {
    for (let j = 0; j < allCategories.length; j++) {
      if (games[i].categoryId === allCategories[j].id) {
        games[i].categoryName = allCategories[j].name;
        break;
      }
    }
  }

  //filter by queryString
  if(name){
    const filteredByInitial = games.filter((obj) => {
        for( let i = 0 ; i < name.length ; i++){
            if(obj.name[i].toLowerCase() !== name[i].toLowerCase()) return false;
        }
        return true;
    } )

    return res.send(filteredByInitial);
  }

  res.send(games);
}



export async function insertGame(req,res){
    const newGame = req.body;
    const allGames = await connection.query("SELECT * FROM games");
    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().optional(),
        stockTotal: joi.number().min(0).required(),
        categoryId: joi.number().min(0).required(),
        pricePerDay: joi.number().min(0).required()
    });

    const {error} = gameSchema.validate(newGame);

    const checkId = () => {
        for(let i = 0 ; i < allGames.length ; i++){
            // if( allGames[i].id ===  )
        }
    }
    if(error){
        return res.sendStatus(400);
    }


}
