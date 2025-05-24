 import { useRef,useEffect ,useContext} from "react"
 import { FinanceContext } from "@/lib/finance-context";
 import { authContext } from "@/lib/store/auth-context";
 import { currencyFormatter } from "@/lib/utils";
 import  {toast} from "react-toastify";
 //icons
 import {FaRegTrashAlt} from 'react-icons/fa'
 import Modal from '@/components/Modal' 


 function AddIncomeModal({show,onClose}){
   const amountRef=useRef()
   const descriptionRef=useRef()

   const {income,addIncomeItem,removeIncomeItem}=useContext(FinanceContext);
  
   const {user}=useContext(authContext);

   //HANDLER FUNCTION
   
   const addIncomeHandler = async (e) => {
    e.preventDefault();

    const newIncome = {
      amount: +amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: new Date(),
      uid:user.uid,
    };

    try {
      await addIncomeItem(newIncome); //  Calls correct function from FinanceContext
      descriptionRef.current.value = "";
      amountRef.current.value = "";
      toast.success('Income Added Successfully!');
    } catch (error) {
      console.log("Error adding income:", error.message);
      toast.error(error.message);
    }
  };

    const deleteIncomeEntryHandler = async (incomeId) => {
        try {
          await removeIncomeItem(incomeId);
          toast.success("Income Deleted Successfully!! ") // ✅ Calls correct function from FinanceContext
        } catch (error) {
          console.log("Error deleting income:", error.message);
          toast.error(error.message);
        }
      };

    

    return (
      <Modal show={show} onClose={onClose}>
        <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
         <div className="input-group">
           <label htmlFor="amount">Income Amount</label>
           <input 
             type="number"
             name="amount"
             ref={amountRef}
             min={0.01} 
             step={.01}
             placeholder='enter income amount' 
             required/>

          </div>
          <div className="flex flex-col gap-4">
              <label htmlFor="description">description</label>
              <input  name="description" ref={descriptionRef} type="text"  placeholder='enter income description' required/>
          </div>
          <button type="Submit" className="btn btn-primary ">Add Entry</button>
          
        </form>
        <div className='flex flex-col gap-4 mt-6'>
          <h3 className='text-2xl'>Income History</h3>
          {income.map(i=>{
            return (
              <div className="flex justify-between item-center "key={i.id}>
                  <div>
                    <p className='font-semibold'>{i.description}</p>
                    <small className='text-xs'>{i.createdAt.toISOString()}</small>
                  </div>
                  <p className='flex items-center gap-2'>{currencyFormatter(i.amount)}
                  <button onClick={()=>{deleteIncomeEntryHandler(i.id)}}><FaRegTrashAlt/></button>
                  </p>
              </div>
              )
            })
   
          }
        </div>
      
      </Modal>
      )
}
export default AddIncomeModal;