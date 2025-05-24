"use client";
import { useActionState, useState } from 'react';
import { currencyFormatter } from "@/lib/utils";
import ViewExpenseModal from './modals/ViewExpenseModal';

function ExpenseCategoryItem({expense}){
    const [showViewExpenseModal,setViewExpenseModal]=useState(false);
    return (    
      <>
      <ViewExpenseModal show={showViewExpenseModal} onClose={setViewExpenseModal} expense={expense}/>
      <button onClick={()=>{
        setViewExpenseModal(true);
        }}>
        <div className="flex items-center justify-between px-4 py-4 bg-[#4A90E2] rounded-3xl  transition-all duration-100 hover:scale-110">
          <div className="flex items-center gap-2">
               <div className="w-[25px] h-[25px] rounded-full "style={{backgroundColor:expense.color}}/>
               <h4 className="capitalise text-white">{expense.title}</h4>
          </div>
          <p>{currencyFormatter( expense.total)}</p>
       </div>
      </button>
  </>
    );
}

export default  ExpenseCategoryItem;