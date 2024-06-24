const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://kurochkinseva:I4Lnza3N9kIdYHf9@cluster0.ali4lwq.mongodb.net/')
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));