import connection from "../dbStrategy/postgres.js";
import joi from "joi";

export async function getCustomers(req, res) {
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);
  const cpfSearch = req.query.cpf;

  if (cpfSearch) {
    const filteredByCPF = customers.filter((customer) => {
      for (let i = 0; i < cpfSearch.length; i++) {
        if (customer.cpf[i] !== cpfSearch[i]) return false;
      }
      return true;
    });
    return res.send(filteredByCPF);
  }

  res.send(customers);
}

export async function getCustomersById(req, res) {
  const { id } = req.params;
  const { rows: customer } = await connection.query(
    ` SELECT * FROM customers WHERE id = $1`,
    [id]
  );

  res.send(customer);
}

export async function insertCustomers(req, res) {
  const newCustomer = req.body;
  const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi
      .string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
  });
  try {
    const { error } = customerSchema.validate(newCustomer);
    const { rows: cpfTaken } = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [newCustomer.cpf]
    );

    if (error) {
      return res.sendStatus(400);
    } else if (cpfTaken.length !== 0) return res.sendStatus(409);

    await connection.query(
      `INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)`,
      [
        newCustomer.name,
        newCustomer.phone,
        newCustomer.cpf,
        newCustomer.birthday,
      ]
    );
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const newCustomer = req.body;
  const { id } = req.params;
  const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi
      .string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
  });

  try {
    const { error } = customerSchema.validate(newCustomer);
    const { rows: cpfTaken } = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [newCustomer.cpf]
    );
    console.log(cpfTaken);
    if (error) {
      return res.sendStatus(400);
    } else if (cpfTaken.length !== 0) return res.sendStatus(409);

    await connection.query(
      `UPDATE customers SET name=$1, phone=$2, cpf = $3, birthday=$4
       WHERE id=$5 `,
      [
        newCustomer.name,
        newCustomer.phone,
        newCustomer.cpf,
        newCustomer.birthday,
        id,
      ]
    );
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}
