"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import "./addNewCategroy.css"


export default function AddNewCatagery({onCategoryAdd}) {


  let [isChecked,setIsChecked]= useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  


  let handleCheckBox=(e)=>{
   console.log(e.target.checked)
   console.log("dddddddddddddddddddddddddddddd")
      setIsChecked(e.target.checked);
  }

  const onSubmit = (data) => {
    console.log(data);
    if(data){
      axios.post("api/category",data).then((resp)=>{
         console.log(resp.data.success);
         console.log("yes the data is comming");
         if(resp.data.success){
           toast.success("data save successfull")
           onCategoryAdd(resp.data.newCategory)
         }else{
          toast.error("not save successfull")
         }
      })
        
    }
    else{
      toast.error("data not save")
    }
    // You can handle form submission here
  };

  return (
    <div>
      <div className="p-3" style={{ border: '1px solid gray', borderRadius: '10px' }}>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className='pt-2 pb-2'>
            <h6><b>Add New  Categories</b></h6>
          </div>

          <div className="d-flex mt-2">
            <div className="leftName">
              <span className="form-label"><b>Category Name</b></span><span className='ms-2  star'>*</span>
            </div>
            <div className="rightInputs">
              <input
                className="form-control"
                {...register('catEnglishName', { required: 'English name is required' })}
              />
              {errors.catEnglishName && (
                <p style={{ color: 'red' }}>{errors.catEnglishName.message}</p>
              )}
            </div>
          </div>

          <div className="d-flex mt-2">
            <div className="leftName">
              <span className="form-label"><b>Category Name</b></span><span className='ms-2  star'>*</span>
            </div>
            <div className="rightInputs">
              <input
                className="form-control"
                {...register('catArabicName', { required: 'Arabic name is required' })}
              />
              {errors.catArabicName && (
                <p style={{ color: 'red' }}>{errors.catArabicName.message}</p>
              )}
            </div>
          </div>

          <div className="d-flex mt-2">
            <div className="leftName">
              <span className="form-label"><b>From assets?</b></span><span className='ms-2  star'>*</span>
            </div>
            <div className="rightInputs">
              <input
                   onChange={handleCheckBox}
                 className="" type="checkbox" {...register('fromAssets',{required:"this field is required"})} />
             
              <span><b>Add this category to the assets of the office</b></span>
              {errors.fromAssets && (
                <p style={{ color: 'red' }}>{errors.fromAssets.message}</p>
              )}
            </div>
          </div>
               {/* {isChecked? */}
                <div className="d-flex mt-2">
            <div className="leftName">
              <span className="form-label"><b>Annual Decrement Percentage</b></span> 
            </div>
            <div className="rightInputs">
              <input
                className="form-control"
                type="number"
                {...register('annualDecrement', {
                    
                  min: { value: 0, message: 'Percentage must be positive' },
                  max: { value: 100, message: 'Percentage cannot exceed 100' },
                })}
              />
              {errors.annualDecrement && (
                <p style={{ color: 'red' }}>{errors.annualDecrement.message}</p>
              )}
            </div>
          </div>
         {/* //  :null  } */}
          

          <div className="text-end mt-2 pt-2" style={{ borderTop: '1px solid gray' }}>
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
