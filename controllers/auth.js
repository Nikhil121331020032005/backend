const Anilist = require("../models/user");


// Home route
const home = async (req, res) => {
  try {
    res.status(200).send("<h1>It's a home page</h1>");
  } catch (error) {
    console.log("auth home error", error);
  }
};

// Register route
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await Anilist.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "email already exist" });
    }

    const userCreated = await Anilist.create({
      username,
      email,
      password,
    });

    res.status(200).json({
      msg: "registration successfully completed",
      data: userCreated,
      token: await userCreated.generateToken(),
    });
  } catch (error) {
    console.log("auth register error", error);
    res.status(500).json({ msg: "server error" });
  }
};

// Login route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await Anilist.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ msg: "email doesn't exist, create one first" });
    }

   
    if (password === userExists.password) {
      return res.status(200).json({
        msg: "login successfully completed",
        data: userExists,
        token: await userExists.generateToken(),
      });
    } else {
      return res.status(401).json({ msg: "invalid password or email, check again" });
    }
  } catch (error) {
    console.log("auth login error", error);
    res.status(500).json({ msg: "server error" });
  }
};


//user 
const user = async(req,res) => {
 try {
  const userData = req.user;
  console.log(userData);
  return res.status(200).json({msg:userData})
 } catch (error) {
  console.log(`error ${error}`)
 } 
}


module.exports = { home, login, register , user };
