"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import "./addNewExpense.css"



export default function AddNewExpensive({onExpenseAdd}) {

   let { register, handleSubmit, formState: { errors } } = useForm()
   let [categories,setCategories]  = useState([]);

    

   useEffect(function(){
  axios.get("api/category").then(function(resp){
   console.log(resp.data);
   console.log(resp.data.categories);
   setCategories(resp.data.categories)

  })

   },[])

let onSubmit=(data)=>{
   console.log(data)
   if(data){
      axios.post("api/expense",data).then(function(resp){
         console.log(resp.data);
         if(resp.data.success){
            toast.success("data save successfull");
            onExpenseAdd(resp.data.newExpense)
            
         }else{
            toast.error("data not save")
         }
      })
   }else{
      toast.error("there is no data come from form")
   }
}
   return <div>
      <div className="p-3 " style={{ border: "1px solid gray", borderRadius: "10px" }}>
         <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="py-2">
               <h6><b>Add New Expense Catageries</b></h6>
            </div>
            <div className="d-flex mt-2">
               <div className="leftName" ><span className="form-lebel"><b>Date</b></span> <span className="ms-2 star">*</span></div>
               <div className="rightInputs">
                  <input type="date" {...register("date",{required:"this field is required"})} className="form-control" placeholder="Date"></input>
                  {errors.date ?<div className="text-danger">{errors.date.message}</div>:""}

                  </div>
            </div>

            <div className="d-flex mt-2">
               <div className="leftName" ><span className="form-lebel"><b>Expense Catagory</b></span><span className="ms-2 star">*</span></div>
               <div className="rightInputs">
                  <select className="form-select" {...register("expenseCategory",{required:"this field is required"})}> 
                     <option>select...</option>
                     {
                        categories.map(function(category){
                           return <option value={category._id}>{category.catEnglishName}</option>
                        })
                     }
                  </select>
                  {/* <input {...register("expenseCategory",{required:"this field is required"})} type="text" className="form-control"></input> */}
                  {errors.expenseCategory ?<div className="text-danger">{errors.expenseCategory.message}</div>:""}

               </div>
            </div>
            <div className="d-flex mt-2">
               <div className="leftName" ><span className="form-lebel"><b>Note</b></span><span className="ms-2 star">*</span></div>
               <div className="rightInputs">
                  <textarea {...register("note")} className="form-control" placeholder="Please Enter Note"></textarea>
               </div>
            </div>


            <div className="d-flex mt-2">
               <div className="leftName" ><span className="form-lebel"><b>Amount</b></span><span className="ms-2 star">*</span></div>
               <div className="rightInputs">
                  <input {...register("amount",{required:"this field is required" })}  placeholder="Please Enter Amount"   className="form-control" type="number"></input> 
                  {errors.amount ?<div className="text-danger">{errors.amount.message}</div>:""}
                   </div>
            </div>

            <div className="d-flex mt-2">
               <div className="leftName" ><span className="form-lebel"><b>VAT Percentage</b></span></div>
               <div className="rightInputs"><input {...register("vatPercentage")} type="number" placeholder="0%" className="form-control"></input></div>
            </div>
            <div className="text-end mt-2 pt-2" style={{ borderTop: "1px solid gray" }}>
               <button type="submit" className=" btn btn-primary">Add</button>
            </div>
         </form>
      </div>
   </div>
}