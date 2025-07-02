const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Airline {
  constructor(AirlineID, AirlineName, IATA_Code, ICAO_Code, BicyclePolicy) {
    this.AirlineID = AirlineID;
    this.AirlineName = AirlineName;
    this.IATA_Code = IATA_Code;
    this.ICAO_Code = ICAO_Code;
    this.BicyclePolicy = BicyclePolicy;
  }

  
  static async getAllAirlines() {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const result = await connection.query("SELECT * FROM Airlines");
      return result.recordset.map((row) => new Airline(row.AirlineID, row.AirlineName, row.IATA_Code, row.ICAO_Code, row.BicyclePolicy));
    } catch (error) {
      console.error("Error fetching airlines:", error);
      throw new Error("Database query failed");
    } finally {
      if (connection) connection.close();
    }
  }

  
  static async getAirlineById(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input("id", sql.Int, id);
      const result = await request.query("SELECT * FROM Airlines WHERE AirlineID = @id");

      if (result.recordset.length === 0) {
        throw new Error(`No airline found with ID ${id}`);
      }
      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching airline by ID:", error);
      throw error;
    } finally {
      if (connection) connection.close();
    }
  }

  
  static async createAirline(data) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input("AirlineName", sql.NVarChar, data.AirlineName);
      request.input("IATA_Code", sql.NVarChar, data.IATA_Code);
      request.input("ICAO_Code", sql.NVarChar, data.ICAO_Code);
      request.input("BicyclePolicy", sql.NVarChar, data.BicyclePolicy);

      const result = await request.query(`
        INSERT INTO Airlines (AirlineName, IATA_Code, ICAO_Code, BicyclePolicy)
        VALUES (@AirlineName, @IATA_Code, @ICAO_Code, @BicyclePolicy);
        SELECT SCOPE_IDENTITY() AS AirlineID;
      `);
      return this.getAirlineById(result.recordset[0].AirlineID);
    } catch (error) {
      console.error("Error creating airline:", error);
      throw new Error("Database insert failed");
    } finally {
      if (connection) connection.close();
    }
  }

 
  static async getBicyclePolicyByAirlineName(airlineName) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input('AirlineName', sql.NVarChar, `%${airlineName}%`); 
      
      const result = await request.query(`
        SELECT BicyclePolicy FROM Airlines 
        WHERE AirlineName LIKE @AirlineName
      `);

      if (result.recordset.length === 0) {
        throw new Error(`No airline found matching "${airlineName}"`);
      }
      return result.recordset[0].BicyclePolicy;
    } catch (error) {
      console.error("Error fetching bicycle policy by name:", error);
      throw error;
    } finally {
      if (connection) connection.close();
    }
  }


  static async getBicyclePolicyByAirlineId(airlineId) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input('AirlineID', sql.Int, airlineId);
      
      const result = await request.query("SELECT BicyclePolicy FROM Airlines WHERE AirlineID = @AirlineID");

      if (result.recordset.length === 0) {
        throw new Error(`No airline found with ID ${airlineId}`);
      }
      return result.recordset[0].BicyclePolicy;
    } catch (error) {
      console.error("Error fetching bicycle policy by ID:", error);
      throw error;
    } finally {
      if (connection) connection.close();
    }
  }

  static async deleteAirline(id) {
    const connection = await sql.connect(dbConfig);

    
    await connection.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM BicycleSizeRestrictions WHERE AirlineID = @id");

    
    await connection.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Airlines WHERE AirlineID = @id");

    connection.close();
  }

  static async updateAirline(AirlineID, AirlineName, IATA_Code, ICAO_Code, BicyclePolicy) {
    console.log("🔄 Executing Update Query for AirlineID:", AirlineID);

    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("AirlineID", sql.Int, AirlineID);
    request.input("AirlineName", sql.VarChar, AirlineName);
    request.input("IATA_Code", sql.VarChar, IATA_Code);
    request.input("ICAO_Code", sql.VarChar, ICAO_Code);
    request.input("BicyclePolicy", sql.Text, BicyclePolicy);

    const result = await request.query(`
        UPDATE Airlines
        SET AirlineName = @AirlineName, IATA_Code = @IATA_Code, 
            ICAO_Code = @ICAO_Code, BicyclePolicy = @BicyclePolicy
        WHERE AirlineID = @AirlineID;
    `);

    connection.close();

    return result.rowsAffected[0] > 0; // ✅ Returns `true` if update was successful
}

  
}

module.exports = Airline;
