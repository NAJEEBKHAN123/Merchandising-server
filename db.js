const mongoose = require('mongoose')


const connectDB = async() =>{
    try {
         await mongoose.connect(process.env.DB_URL)
         console.log(`✅ MongoDB Connected successfully`);
    } catch (error) {
         console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
}

module.exports = connectDB