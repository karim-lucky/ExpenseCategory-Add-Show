"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import MyTab from "../../components/tab/tabs";
import "./categoryShow.css"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CategoryShow() {
    const [currentPage, setCurrentPage] = useState(1);

    const [mycategory, setMycategory] = useState([]);
    const [currentShow, setCurrentShow] = useState("category");

    const [currentCategory, setCurrentCategory] = useState([]);
    const [searchNote, setSearchNote] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    let { register, handleSubmit, formState: { errors } } = useForm()
    
    const [selectedCategory, setSelectedCategory] = useState(null);

     
    const [expenseFromDate, setexpenseFromDate] = useState("");
    const [expenseToDate, setexpenseToDate] = useState("");

    

     


    useEffect(() => {
        axios.get("/api/category").then((resp) => {
            console.log("Fetched categories:", resp.data);
            setMycategory(resp.data.categories);
        });
    }, []);

    let onSubmitUpdateForm = (data) => {
        console.log(data);
        console.log("selectedExpense after update:", selectedExpense);
    
        let payload = {
            updatedData: data,
            _id: selectedExpense._id,
            newCategoryId: selectedExpense.expenseCategory,
            oldCategoryId: currentCategory._id,
        };
    
        axios.put("/api/expense", payload).then(function (resp) {
            if (resp.data.success) {
                
                setSelectedCategory({
                    ...selectedCategory,
                    expenses: selectedCategory.expenses.map((expense) => {
                        
                        if (expense._id === selectedExpense._id) {
                            return { ...expense, ...data }; // Update the expense with new data
                        }
                        return expense; // Keep other expenses unchanged
                    }),
                });
    
                toast.success("Record updated successfully");
            } else {
                toast.error("Record not updated");
            }
        }).catch((error) => {
            console.error("Error updating expense:", error);
            toast.error("Update Operation Failed!");
        });
    };
    

    const [selectedExpense, setSelectedExpense] = useState([]); // Store the selected expense for updation of

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        console.log("Dddddddddddddddddddd")
    };
    let handleDeleteExpanse = (expense) => {
        console.log("this is expanse")
        console.log(expense)
        if (expense) {
            axios.delete("/api/expense", { data: { _id:expense._id} }).then(function (resp) {
                console.log("this is response from delete api")
                console.log(resp.data);
                if (resp.data.success) {
                    toast.success("expense delete successfull");

                   setSelectedCategory({
                    ...selectedCategory,
                     expenses:selectedCategory.expenses.filter((u)=>{
                        debugger;
                        return u._id!==expense._id
                    })});

                


                     
                } else {
                    toast.error("Delete Operation Failed!")
                }
            })
        } else {
            toast.error("Delete Operation Failed!")
        }
    }
    const filterByDate = (data, from, to, dateField) => {
        return data.filter(item => {
            const date = moment(item[dateField]);
            return (!from || date.isSameOrAfter(moment(from, 'YYYY-MM-DD'))) &&
                (!to || date.isSameOrBefore(moment(to, 'YYYY-MM-DD')));
        });
    };

    const handleDateSort = () => {
        if (currentShow === "category") {
            const filteredCategories = filterByDate(mycategory, fromDate, toDate, 'updateDate');
            setMycategory(filteredCategories);
        } else if (currentShow === "expense" && selectedCategory) {
            const filteredExpenses = filterByDate(selectedCategory.expenses, expenseFromDate, expenseToDate, 'date');
            setSelectedCategory({ ...selectedCategory, expenses: filteredExpenses });
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentShow("expense");
    };

    const handleBackClick = () => {
        setCurrentShow("category");
        setSelectedCategory(null);
    };

    const onExpenseAdd = (expense) => {
        let currentCategory = mycategory.find((category) => category._id === expense.expenseCategory);
        if (currentCategory) {
            currentCategory.expenses.push(expense);


            setMycategory([...mycategory]);
            // setloading("loading data.................")
        }
    };

    const onCategoryAdd = (newCategory) => {
        setMycategory([...mycategory, newCategory,]); // Add new category to the list
    };

    const itemsPerPage = 8;
    let pageindexes = currentPage
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mycategory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(mycategory.length / itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [expensePage, setExpensePage] = useState(1);
    const expenseItemsPerPage = 4;
    let pageindese = expensePage
    const expenseIndexOfLastItem = expensePage * expenseItemsPerPage;
    const expenseIndexOfFirstItem = expenseIndexOfLastItem - expenseItemsPerPage;
    const currentExpenses = selectedCategory?.expenses.slice(expenseIndexOfFirstItem, expenseIndexOfLastItem) || [];
    const totalExpensePages = Math.ceil((selectedCategory?.expenses.length || 0) / expenseItemsPerPage);

    const handleExpensePageClick = (pageNumber) => {
        setExpensePage(pageNumber);
    };

    return (
        <div className="catrgoryDivMain">
            <div className="row d-md-flex  catrgoryDivMain-2" >
                <div className="col-md-4 col-sm-12 me-3">

                    <MyTab onExpenseAdd={onExpenseAdd} onCategoryAdd={onCategoryAdd} />

                </div> 
                
                <div className="col-md-7 col-sm-12  flex-grow-1" >
                    {currentShow === "category" ? (
                        <>
                            
                            <div className="bg-white ps-2 pt-2">
                                <span><b>Sort By Dates</b></span>
                                <div className="mt-2 align-items-center d-flex">
                                    <span className="me-2">From</span>
                                    <input className="w-25 form-control me-2" type="date" onChange={(e) => setFromDate(e.target.value)} />
                                    <span className="me-2">To</span>
                                    <input className="w-25 form-control me-2" type="date" onChange={(e) => setToDate(e.target.value)} />
                                    <button className="btn btn-primary" onClick={handleDateSort}>Sort</button>
                                </div>
                            </div>

                            <div className="bg-white mt-3">
                                <table className="table   myTable"  >
                                    <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>Expense Category</th>
                                            <th>Office Asset</th>
                                            <th>Expense Count</th>
                                            <th>Total Expenses</th>
                                            <th>Total VAT</th>
                                            <th>Last Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((category, index) => (
                                            <tr key={category._id} onClick={() => {
                                                setCurrentCategory(category),
                                                    handleCategoryClick(category)
                                            }}>
                                                <td>{index + 1 + (pageindexes - 1) * itemsPerPage}</td>
                                                <td>{category.catEnglishName}</td>
                                                <td>{category.fromAssets ? <i className="fa-solid fa-check"></i> : "No"}</td>
                                                <td>{category.expenses.length}</td>
                                                <td>{category.expenses.reduce((sum, expense) => sum + expense.amount, 0)}</td>
                                                <td>{category.expenses.reduce((sum, expense) => sum + expense.vatPercentage, 0)}</td>
                                                <td>{moment(category.updateDate).format('L')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='d-flex justify-content-center'>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageClick(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, pageIndex) => (
                                                <li key={pageIndex} className={`page-item ${currentPage === pageIndex + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageClick(pageIndex + 1)}>
                                                        {pageIndex + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageClick(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between mb-2 bg-white align-items-center p-2">
                                <div className="d-flex flex-wrap">
                                    <div className="me-3"><i class="fa-solid fa-file-invoice-dollar me-1"></i><span className=""><b>Category:</b></span><small >{currentCategory.catEnglishName}</small></div>
                                    <div className="me-3"><span><i class="fa-solid fa-hands-bound me-1 ms-1"></i><b>Office Assets:</b></span>{currentItems.fromAssets ? <small>YES</small> : <small>No office Assist</small>}</div>
                                    <div className="me-3"><i class="fa-solid fa-arrow-up-right-dots me-1"></i><span><b>Annual Decrement:-</b></span></div>
                                </div>
                                {/* <div>
                                    <button className="btn">Show</button>
                                    <button className="btn">Edit</button>
                                </div> */}
                            </div>


                            <div className="pt-2  ">
                                <div className="row m-0 bg-white  ">
                                    <div className="col-12 col-md-6 d-flex  first ">
                                        <div className="p-2">
                                            <span><b>Count</b></span>
                                            <div className="mt-1">{selectedCategory?.expenses.length || 0}</div>
                                        </div>
                                        <div className="p-2 ">
                                            <span><b>Total</b></span>
                                            <div className="mt-1">{selectedCategory?.expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0}</div>
                                        </div>
                                        <div className="p-2">
                                            <div className="d-flex justify-content-between">
                                                <span><b>Search In Table</b></span>
                                                <div><i className="fa-solid fa-magnifying-glass"></i></div>
                                            </div>
                                            <div className="d-flex">
                                                <input className="form-control" type="search" placeholder="Search by note" onChange={(e) => setSearchNote(e.target.value)} />
                                                <div>
                                                    <button className="btn btn-primary">Search</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6  first " >
                                        <span><b>Sort By Dates</b></span>
                                        <div className="mt-2 align-items-center d-flex">
                                            <span className="me-2">From</span>
                                            <input className="w-25 form-control me-2" type="date" onChange={(e) => setexpenseFromDate(e.target.value)} />
                                            <span className="me-2">To</span>
                                            <input className="w-25 form-control me-2" type="date" onChange={(e) => setexpenseToDate(e.target.value)} />
                                            <button className="btn btn-primary" onClick={handleDateSort}>Sort</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                {/* <button className="btn btn-primary mt-2" onClick={handleBackClick}>Back to Categories</button> */}
                                <div onClick={handleBackClick}>
                                    <i class="fa-solid fa-left-long arroricon"></i>
                                    <div><h6><b>Go Back</b></h6></div>
                                </div>

                            </div>
                            <div className="bg-white mt-2">
                                <table className="table myTable table-bordered" >
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Expense Date</th>
                                            <th>Expanse Category</th>
                                            <th>Amount</th>
                                            <th>VAT ammount</th>
                                            <th>current Value</th>
                                            <th>Note</th>
                                            <th>edit</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentExpenses
                                            ?.filter(expense => searchNote === "" || expense.note.toLowerCase().includes(searchNote))
                                            .map((expense, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1 + (pageindese - 1) * expenseItemsPerPage}</td>
                                                    <td>{moment(expense.date).format('L')}</td>
                                                    <td>{currentCategory.catEnglishName}</td>
                                                    <td>{expense.amount}</td>
                                                    <td>{expense.vatPercentage}</td>
                                                    <td>-</td>
                                                    <td>{expense.note}</td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <a
                                                                className="  "
                                                                href="#"
                                                                role="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i class="fa-solid fa-ellipsis-vertical"></i>
                                                            </a>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <a className="dropdown-item" href="#" onClick={() => handleDeleteExpanse(expense)}  >
                                                                        Delete
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        onClick={() => handleEditExpense(expense)}
                                                                        type="button"
                                                                        className="btn dropdown-item"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#exampleModal"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </li>

                                                            </ul>
                                                        </div>

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <div className='d-flex justify-content-center'>
                                    <nav aria-label="Expense page navigation example">
                                        <ul className="pagination">
                                            <li className={`page-item ${expensePage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handleExpensePageClick(expensePage - 1)}
                                                    disabled={expensePage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalExpensePages)].map((_, pageIndex) => (
                                                <li key={pageIndex} className={`page-item ${expensePage === pageIndex + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handleExpensePageClick(pageIndex + 1)}>
                                                        {pageIndex + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${expensePage === totalExpensePages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handleExpensePageClick(expensePage + 1)}
                                                    disabled={expensePage === totalExpensePages}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                            </div>
                            <div className="d-flex justify-content-center">
                                <div>
                                    <button className="btn btn-primary "><span>Expense Count: </span>{selectedCategory?.expenses.length || 0}</button>
                                </div>
                            </div>
                            <>
                                <div
                                    className="modal fade"
                                    id="exampleModal"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">
                                                    Edit Expanse
                                                </h1>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                />
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={handleSubmit(onSubmitUpdateForm)} className="form">
                                                     
                                                    <div className="d-flex mt-2">
                                                        <div className="leftName" ><span className="form-lebel"><b>Date</b></span> <span className="ms-2 star">*</span></div>
                                                        <div className="rightInputs">
                                                            <input
                                                                type="date"
                                                                {...register("date")}
                                                                value={moment(selectedExpense.date).format('YYYY-MM-DD')}
                                                                onChange={(e) => setSelectedExpense({ ...selectedExpense, date: e.target.value })}
                                                                className="form-control"
                                                                placeholder="Date"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mt-2">
                                                        <div className="leftName" ><span className="form-lebel"><b>Expense Catagory</b></span><span className="ms-2 star">*</span></div>
                                                        <div className="rightInputs">
                                                            <select
                                                                className="form-select"
                                                                {...register("expenseCategory",{required:true})}
                                                                value={selectedExpense.expenseCategory || currentCategory._id}
                                                                onChange={(e) => {
                                                                    const selectedValue = e.target.value;
                                                                    const selectedOption = mycategory.find(category => category._id === selectedValue);
                                                                    setSelectedExpense({
                                                                        ...selectedExpense,
                                                                        expenseCategory: selectedValue,
                                                                        catEnglishName: selectedOption ? selectedOption.catEnglishName : currentCategory.catEnglishName
                                                                    });
                                                                }}
                                                            >
                                                                <option value={currentCategory._id}>{currentCategory.catEnglishName}</option>
                                                                {mycategory.map((category) => (
                                                                    <option key={category._id} value={category._id}>
                                                                        {category.catEnglishName}
                                                                    </option>
                                                                ))}
                                                            {errors.expenseCategory ?<span className="text-danger">please select the category</span>:null}
                                                            </select>
 
                                                        </div>
                                                    </div>
                                                    <div className="d-flex mt-2">
                                                        <div className="leftName" ><span className="form-lebel"><b>Note</b></span><span className="ms-2 star">*</span></div>
                                                        <div className="rightInputs">
                                                            <textarea {...register("note",{required:true})}
                                                                onChange={(e) =>  setSelectedExpense({ ...selectedExpense, note: e.target.value })}
                                                                value={selectedExpense.note}
                                                                className="form-control"></textarea>
                                                            {errors.note ?<span className="text-danger">enter note form start to update</span>:null}

                                                        </div>
                                                    </div>
                                                    <div className="d-flex mt-2">
                                                        <div className="leftName" ><span className="form-lebel"><b>Amount</b></span><span className="ms-2 star">*</span></div>
                                                        <div className="rightInputs">
                                                            <input
                                                                {...register("amount",{required:true})} placeholder="Please Enter Amount"
                                                                value={selectedExpense.amount}
                                                                onChange={(e) => setSelectedExpense({ ...selectedExpense, amount: e.target.value })}
                                                                className="form-control" type="number">
                                                            </input>
                                                            {errors.amount ?<span className="text-danger">enter amount form start to update</span>:null}

                                                        </div>
                                                    </div>

                                                    <div className="d-flex mt-2">
                                                        <div className="leftName" ><span className="form-lebel"><b>VAT Percentage</b></span></div>
                                                        <div className="rightInputs">
                                                            <input {...register("vatPercentage")} type="number"
                                                                value={selectedExpense.vatPercentage}
                                                                onChange={(e) => setSelectedExpense({ ...selectedExpense, vatPercentage: e.target.value })}
                                                                placeholder="0%" className="form-control" ></input></div>
                                                    </div>
                                                    <div className="text-end mt-2 pt-2" style={{ borderTop: "1px solid gray" }}>
                                                        <button
                                                            type="button"
                                                            className="btn me-2"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Close
                                                        </button>
                                                        <button type="submit" className="btn btn-primary" >
                                                            Update
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
