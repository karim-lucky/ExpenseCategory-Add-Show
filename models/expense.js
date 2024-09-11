

import mongoose from "mongoose";

let expenseSchema = mongoose.Schema({

    amount: Number,

    date: Date,

    expenseCategory: {
        ref:"Category",
        type:mongoose.SchemaTypes.ObjectId
    },

    note: String,

    vatPercentage: Number

})
 export let Expense= mongoose.models.expenses||mongoose.model("expenses",expenseSchema)
