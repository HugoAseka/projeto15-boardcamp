import connection from "../dbStrategy/postgres.js";
import joi from "joi";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { rows: rentals } = await connection.query(`SELECT * FROM rentals`);
  const { rows: games } = await connection.query(`SELECT * FROM games`);
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);
  const { customerId, gameId } = req.query;

  const finalArr = rentals.map((rental, index) => {
    return {
      ...rental,
      game: games[index],
      customer: customers[index],
    };
  });

  if (customerId && gameId) {
    const result = finalArr.filter(
      (rental) => rental.customerId == customerId && rental.gameId == gameId
    );
    return res.send(result);
  } else if (customerId) {
    const result = finalArr.filter((rental) => rental.customerId == customerId);
    return res.send(result);
  } else if (gameId) {
    const result = finalArr.filter((rental) => rental.gameId == gameId);
    return res.send(result);
  }

  res.send(finalArr);
}

export async function insertRental(req, res) {
  const rentDate = dayjs().format("YYYY/MM/DD");
  const newRental = req.body;
  const { rows: gameObj } = await connection.query(
    `SELECT * FROM games WHERE id = $1`,
    [newRental.gameId]
  );

  const { rows: existingCustomer } = await connection.query(
    `SELECT * FROM customers WHERE id = $1`,
    [newRental.customerId]
  );

  const rentalSchema = joi.object({
    customerId: joi.number().min(0).required(),
    gameId: joi.number().min(0).required(),
    daysRented: joi.number().min(0).required(),
  });
  const { error } = rentalSchema.validate(newRental);

  try {
    if (
      error ||
      existingCustomer.length === 0 ||
      gameObj.length === 0 ||
      gameObj[0].stockTotal < 1
    ) {
      return res.sendStatus(400);
    }
    const pricePerDay = gameObj[0].pricePerDay;
    const originalPrice = pricePerDay * newRental.daysRented;
    await connection.query(
      `
    INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        newRental.customerId,
        newRental.gameId,
        rentDate,
        newRental.daysRented,
        null,
        originalPrice,
        null,
      ]
    );

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  const { id: rentalId } = req.params;
  const today = dayjs();
  let returnFee = 0;

  const { rows: aux } = await connection.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [rentalId]
  );
  const rental = aux[0];

  if (rental.length === 0) {
    return res.sendStatus(404);
  } else if (rental.returnDate != null) {
    return res.sendStatus(400);
  }

  try {
    const delayedDays = today.diff(rental.rentDate, "day");

    const delayFee = delayedDays * rental.originalPrice;

    await connection.query(
      `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,
      [today.format("YYYY/MM/DD"), delayFee, rentalId]
    );

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  const { rows: rental } = await connection.query(
    `SELECT * FROM rentals WHERE id=$1 `,
    [id]
  );
  console.log(rental)
  if(rental.length === 0 ) return res.sendStatus(404)
    else if(rental[0].returnDate != null) return res.sendStatus(400)

  await connection.query(` DELETE FROM rentals WHERE id=$1`,[id]);
  res.sendStatus(200);      
}
