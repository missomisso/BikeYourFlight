const sql = require("mssql");
const bcrypt = require("bcrypt"); // For password hashing
const dbConfig = require("../dbConfig");


class User {
    constructor(UserID, Username, Email, PasswordHash) {
        this.UserID = UserID;
        this.Username = Username;
        this.Email = Email;
        this.PasswordHash = PasswordHash;
    }

    static async registerUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const connection = await sql.connect(dbConfig);
        await connection.request()
            .input("Username", sql.VarChar, username)
            .input("Email", sql.VarChar, email)
            .input("PasswordHash", sql.VarChar, hashedPassword)
            .query(`
                INSERT INTO Users (Username, Email, PasswordHash) 
                VALUES (@Username, @Email, @PasswordHash)
            `);
        connection.close();
    }

    static async getUserByEmail(email) {
        const connection = await sql.connect(dbConfig);
        const result = await connection.request()
            .input("Email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE Email = @Email");
        connection.close();
        return result.recordset[0]; // Returns user object
    }

    static async verifyUser(email, password) {
        const user = await User.getUserByEmail(email);
        if (!user) return null;
    
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        return isMatch ? user : null;
    }
}

module.exports = User;