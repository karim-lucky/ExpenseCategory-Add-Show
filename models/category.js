 



import mongoose from "mongoose";

// Define the Category schema
const categorySchema = new mongoose.Schema({
    catArabicName: String,
    catEnglishName: String,
    annualDecrement: Number,
    fromAssets: Boolean,
    expenses: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "expenses"
        }
    ],
    updateDate: { type: Date, default: Date.now }  // Add updateDate field
});

// Middleware to update the updateDate field before saving
categorySchema.pre('save', function (next) {
    this.updateDate = Date.now();
    next();
});

// Export the Category model
export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

