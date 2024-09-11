import { Category } from "@/models/category";
import { NextResponse } from "next/server";
import { Expense } from "@/models/expense";

// import catagoryModel from "@/models/catagoryModel";
// import {Category} from "@/models/catagoryModel"


export async function POST(req){

    try{
        let data= await req.json();
        console.log(data);
         
            let newCategory=new Category(data)
            console.log("this is now datadddddddddddd");
             await newCategory.save()
             console.log(newCategory)
             return NextResponse.json({
                success:true,
                data,
                newCategory,
                message:"data save successfull"
             })
        
        

    }catch(err){
        console.log(err)
        return NextResponse.json({
            success:false
        })
    }



}

export async function GET(req) {

    //    let categories =await Category.find();
          console.log("ppppppppppppppppppppppppppppppp");

    
           let categories = await Category.find().populate({ path: "expenses", select: "amount note date vatPercentage expenseCategory" }).exec();
    
            console.log(categories);


       return NextResponse.json({
        success:true,
        categories
       })
       
    
}