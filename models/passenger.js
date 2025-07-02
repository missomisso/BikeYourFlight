const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Passenger {
  constructor(PassengerID, FullName, Email, PhoneNumber, AirlineID) {
    this.PassengerID = PassengerID;
    this.FullName = FullName;
    this.Email = Email;
    this.PhoneNumber = PhoneNumber;
    this.AirlineID = AirlineID;
  }

  static async createPassenger(data) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("FullName", sql.NVarChar, data.FullName);
    request.input("Email", sql.NVarChar, data.Email);
    request.input("PhoneNumber", sql.NVarChar, data.PhoneNumber);
    request.input("AirlineID", sql.Int, data.AirlineID);
    const result = await request.query(`
      INSERT INTO Passengers (FullName, Email, PhoneNumber, AirlineID)
      VALUES (@FullName, @Email, @PhoneNumber, @AirlineID);
      SELECT SCOPE_IDENTITY() AS PassengerID;
    `);
    connection.close();
    return result.recordset[0].PassengerID;
  }

  static async getPassengerWithAirline(id) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(`
      SELECT p.*, a.AirlineName, a.BicyclePolicy
      FROM Passengers p
      JOIN Airlines a ON p.AirlineID = a.AirlineID
      WHERE p.PassengerID = @id
    `);
    connection.close();
    return result.recordset[0];
  }
}

module.exports = Passenger;
