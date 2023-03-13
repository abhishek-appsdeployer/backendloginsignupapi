const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product =require("./product")
const app = express();
const PORT = process.env.PORT || 8000;
const User =require("./user")
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    dbName: "mydatabase",
    
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
  family:4,
}).then((_) => console.log("Connection to MongoDB eshtablished!"))
.catch((err) => console.log(err));  ;



app.use(express.json());

const userSchema = new mongoose.Schema({
  username: { type: String},
  password: { type: String},
});


app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  }
   catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  User.findOne({ username })
  .exec()
  .then((user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    

    return res.status(200).json({message:"loign succesffully" });
  })
  .catch((err) => {
    return res.status(500).json({ message: 'Internal server error' });
  });

});

// get all users 
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/changepassword', async (req, res) => {
  try {
    const { username, password, npassword } = req.body;

    if (!username || !password || !npassword) {
      return res.status(400).json({ message: 'Username, password, and new password are required' });
    }

    // Find user with the given username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(npassword, 10);

    // Update user's password
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/prodcut', async (req, res) => {
  try {
    console.log("product")
    const { productname, price } = req.body;
      console.log(productname,price)
    // Check if user already exists
    

  

    // Create new user
    const newProduct = new Product({ productname, price});
    await newProduct.save();

    res.status(201).json({ message: 'Product created' });
  }
   catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
