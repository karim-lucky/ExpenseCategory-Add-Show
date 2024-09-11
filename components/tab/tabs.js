
"use client"

import { useState } from "react"
import AddNewCatagery from "../addNewCatagery/addNewCatagery";
import AddNewExpensive from "../addNewexpensive/addNewExpensive";


export default function MyTab({onExpenseAdd ,onCategoryAdd}){
    let [activeTab,setActiveTab]=useState("New Catagory");

  return  <div className="row rounded pt-2 bg-white">
    <div>
      <>
        {/* Tabs navs */}
        <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'Add New Expense' ? 'active' : ''}`}
              id="tab-The Case Facts"
              type="button"
              role="tab"
              onClick={() => setActiveTab('Add New Expense')}
            >
              Add New Expense
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'New Catagory' ? 'active' : ''}`}
              id="tab-The Counseling"
              type="button"
              role="tab"
              onClick={() => setActiveTab('New Catagory')}
            >
              New Catagory
            </button>
          </li>
        
        </ul>
        
        {/* Tabs content */}
        <div className="myBorder">
        <div className="tab-content" id="ex1-content">
          <div
            className={`tab-pane fade ${activeTab === 'Add New Expense' ? 'show active' : ''}`}
            id="tab-Add New Expense"
            role="tabpanel"
          >
            {/* <textarea
              className="form-control mytextArea"
               
              placeholder="The Case Facts..."s
            ></textarea> */}

            
                     <AddNewExpensive onExpenseAdd={onExpenseAdd} ></AddNewExpensive>
          </div>
          <div
            className={`tab-pane fade ${activeTab === 'New Catagory' ? 'show active' : ''}`}
            id="tab-New Catagory"
            role="tabpanel"
          >
          <AddNewCatagery onCategoryAdd={onCategoryAdd}></AddNewCatagery>
          </div>
        </div>
        </div>
        
      </>
    </div>
   
  </div>
}