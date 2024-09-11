import { Category } from "@/models/category";
import { Expense } from "@/models/expense";
import { RSC_ACTION_PROXY_ALIAS } from "next/dist/lib/constants";
import { NextResponse } from "next/server";





export async function POST(req) {



  try {
    let data = await req.json();
    console.log(data);

    let newExpense = new Expense(data);
    await newExpense.save();
    console.log("ddddddddddddddddddddddddddd")
    console.log(newExpense.expenseCategory)

    //  const category = await Category.findById(req.body.expenseCategory);
    const category = await Category.findById(newExpense.expenseCategory);

    console.log("idddddddddddddddddof ccccccccccccccccc");
    console.log(category);


    category.expenses.push(newExpense);
    await category.save();


    return NextResponse.json({
      success: true,
      message: "data save successfull",
      newExpense
    })

  } catch (err) {
    console.log(err + "error occer");
    return NextResponse.json({
      success: false,
      message: "data not save "

    })
  }



}

export async function DELETE(req) {
  console.log("dddddddddddddddddddddd")
  try {
    console.log("eeeeeeeeeeeeeeeeeeeeeeeee")
    // Parse the request body to get the data
    const data = await req.json();

    // Log the received data and the ID to be deleted
    console.log("Received Data:", data);
    console.log("ID to Delete:", data._id);

    // Delete the document from the database using the ID
    const deletedDocument = await Expense.findByIdAndDelete(data._id);

    if (!deletedDocument) {
      return NextResponse.json({
        success: false,
        message: 'Document not found',
      });
    }

    // Return a success response with the deleted document
    return NextResponse.json({
      success: true,
      data: deletedDocument
    });
  } catch (error) {
    console.log("ffffffffffffffffff")
     
    console.error("Error in DELETE API:", error);

    return NextResponse.json({
      success: false,
      message: 'An error occurred during deletion',
    });
  }
}



export async function PUT(req) {
  try {
    const { _id, updatedData, newCategoryId, oldCategoryId } = await req.json();
  
    // Update the expense
    let updatedExpense = await Expense.findByIdAndUpdate(_id, updatedData,);
    if (!updatedExpense) {
      return NextResponse.json({ success: false, message: "Expense not found" });
    }

    if (newCategoryId !== oldCategoryId) {
      // Remove expense from old category 
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { expenses: _id }
      });

      // Add expense to new category
      await Category.findByIdAndUpdate(newCategoryId, {
        $addToSet: { expenses: _id }
      });
    }

    return NextResponse.json({ success: true, updatedData: updatedExpense });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false });
  }
}
