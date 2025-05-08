require('dotenv').config();
const express= require('express');
const morgan = require('morgan');
const cors = require('cors')


const app = express();

console.log("🔹 DB_URI:", process.env.DB_URI); 
console.log('API KEY cargada:', process.env.BREVO_API_KEY);

//Connect to database
require('./config/connect-db')

app.set('PORT',process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())


// Routes
app.use(require('./routes'))


app.listen(app.get('PORT'),()=>console.log(`Server Ready al port ${app.get('PORT')}`))
