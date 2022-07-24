import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);
  const cpfSearch = req.query.cpf;

  if (cpfSearch) {
    const filteredByCPF = customers.filter((customer) => {
      for (let i = 0; i < cpfSearch.length ; i++) {
        if (customer.cpf[i] !== cpfSearch[i]) return false;
      }
      return true;
    });
    return res.send(filteredByCPF);
  }

  res.send(customers);
}
