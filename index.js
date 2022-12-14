const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const clinicalRoute = require("./routes/clinical");
const mongoose = require("mongoose");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const user = require("./user");
const path = require("path");

const app = express();

// database connection
const uri = `mongodb+srv://ibitayo:${process.env.MONGO_DB_PASSWORD}@ibitayodb.pmpom44.mongodb.net/?retryWrites=true&w=majority`;

const connectDatabase = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose is connected");
    } catch (error) {
        console.log(error);
    }
};

connectDatabase();

// middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);
app.set("trust proxy", 1);
app.use(
    cookieSession({
        name: "session",
        keys: ["lama"],
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 100,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.use("/auth", authRoute);
app.use("/clinical", clinicalRoute);

app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running!");
});
