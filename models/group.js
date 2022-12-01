const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    facult : {
        type : String,
        required : true,
    },
    sheetName : {
        type : String,
        required : true,
    },
    group : {
        type : String,
        required : true
    },
    monday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    },
    tuesday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    },
    wednesday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    },
    thursday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    },
    friday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    },
    saturday : {
        type : Array,
        default : [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]
    }
});

const Group = mongoose.model("Group",groupSchema);

module.exports = Group;

// можно добавить в модель еще время добавления для функции сортировки по времени
