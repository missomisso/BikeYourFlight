const sql = require("mssql");
const dbConfig = require("../dbConfig");

class BicycleSizeRestriction {
  constructor( AirlineID, MaxWeight, MaxLength, MaxWidth, MaxHeight ) {
    this.AirlineID = AirlineID;
    this.MaxWeight = MaxWeight;
    this.MaxLength = MaxLength;
    this.MaxWidth = MaxWidth;
    this.MaxHeight = MaxHeight;
  }

  static async getByAirlineId(airlineId) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("airlineId", sql.Int, airlineId);
    const result = await request.query(`
      SELECT * FROM BicycleSizeRestrictions WHERE AirlineID = @airlineId
    `);
    connection.close();
    return result.recordset.map((row) => new BicycleSizeRestriction(row.AirlineID, row.MaxWeight, row.MaxLength, row.MaxWidth, row.MaxHeight));
  }

  static async getByAirlineName(airlineName) {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("airlineName", sql.VarChar, airlineName);
    const result = await request.query(`
      SELECT r.* FROM BicycleSizeRestrictions r
      JOIN Airlines a ON r.AirlineID = a.AirlineID
      WHERE a.AirlineName = @airlineName
    `);
    connection.close();
    return result.recordset.map((row) => new BicycleSizeRestriction(row.AirlineID, row.MaxWeight, row.MaxLength, row.MaxLength, row.MaxWidth, row.MaxHeight));
  }

  static async addRestrictions( AirlineID, MaxWeight, MaxLength, MaxWidth, MaxHeight ) {
    console.log("🚀 Executing SQL Query for AirlineID:", AirlineID);
    
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("AirlineID", sql.Int, AirlineID);
    request.input("MaxWeight", sql.Float, MaxWeight);
    request.input("MaxLength", sql.Float, MaxLength);
    request.input("MaxWidth", sql.Float, MaxWidth);
    request.input("MaxHeight", sql.Float, MaxHeight);
    const query = `
    INSERT INTO BicycleSizeRestrictions (AirlineID, MaxWeight, MaxLength, MaxWidth, MaxHeight)
    VALUES (@AirlineID, @MaxWeight, @MaxLength, @MaxWidth, @MaxHeight);`;
    console.log("🚀 SQL Query:", query);

    await request.query(query);
    connection.close();
  }

  static async getRestrictionById(id) {
    const connection = await sql.connect(dbConfig);
    const result = await connection.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM BicycleSizeRestrictions WHERE RestrictionID = @id");
    connection.close();
    return result.recordset.length > 0 ? result.recordset[0] : null;
  }

  static async deleteRestriction(id) {
    const connection = await sql.connect(dbConfig);
    await connection.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM BicycleSizeRestrictions WHERE RestrictionID = @id");
    connection.close();
  }
}


module.exports = BicycleSizeRestriction;