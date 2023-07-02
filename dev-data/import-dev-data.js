const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: `${__dirname}/../config.env` });
const Tour = require(`${__dirname}/../models/tourModel`);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

try {
  const conn = mongoose.connect(
    DB,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('DB connected sucsessfuly ');
    }
  );
} catch (err) {
  console.log({
    status: 'fail connection to DB !!!!',
    error: err,
  });
}

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8')
);
console.log(tours);

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data inserted successfuly ');
  } catch (err) {
    console.log('Cannot inserted Data');
  }
  process.exit();
};

// console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('enter one of these [--import, --delete]');
  process.exit();
}
