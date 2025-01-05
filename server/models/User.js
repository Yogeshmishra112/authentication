const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, 
    require: true
  },
  email : { type: String,
      require: true,
      unique: true
  },
 password: {
    type : String,
    require: true,
    minlength: 6
 }
 
  }
);
module.exports = mongoose.model("User", userSchema);
//every schema is converted to the model for the use
//schema is used to define 