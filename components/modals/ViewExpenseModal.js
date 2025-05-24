import { useContext } from "react";
import { FinanceContext } from "@/lib/finance-context";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "../Modal";

import { currencyFormatter } from "@/lib/utils";
import {toast} from "react-toastify";

function ViewExpenseModal({ show, onClose, expense }) {
  const { deleteExpenseItem, deleteExpenseCategory } = useContext(FinanceContext);

  // Remove the entire expense category
  const deleteExpenseCategoryHandler = async () => {
    try {
      // Delete the expense category by its ID
      await deleteExpenseCategory(expense.id);
      toast.success("Expense Item removed Succefull!!")
      // Close the modal after deletion (optional, if desired)
      onClose();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // Remove an individual expense item
  const deleteExpenseItemHandler = async (item) => {
    try {
      // Remove the item from the list
      const updatedItems = expense.items.filter((i) => i.id !== item.id);

      // Update the total balance after removing the item
      const updatedExpense = {
        items: [...updatedItems],
        total: expense.total - item.amount,
      };

      await deleteExpenseItem(updatedExpense, expense.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between text-white">
        <h2 className="text-4xl text-white">{expense.title}</h2>
        <button onClick={deleteExpenseCategoryHandler} className="btn btn-danger">
          Delete Category
        </button>
      </div>
      <div>
        <h3 className="my-4 text-2xl  text-white">Expense History</h3>
        {expense.items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between  text-white">
              <small>
                {item.createdAt.toMillis
                  ? new Date(item.createdAt.toMillis()).toISOString()
                  : item.createdAt.toISOString()}
              </small>
              <p className="flex items-center gap-2  text-white">
                {currencyFormatter(item.amount)}

                <button onClick={() => deleteExpenseItemHandler(item)} className="text-red-500">
                  <FaRegTrashAlt />
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default ViewExpenseModal;
