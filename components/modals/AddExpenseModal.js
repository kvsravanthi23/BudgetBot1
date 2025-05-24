import { useState, useContext, useRef } from 'react';
import Modal from '@/components/Modal';
import { FinanceContext } from '@/lib/finance-context';
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function AddExpenseModal({ show, onClose }) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectCategory] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { expenses, balance, addExpenseItem, addCategory } = useContext(FinanceContext);

  const titleRef = useRef();
  const colorRef = useRef();

  const addExpenseItemHandler = async () => {
    const expense = expenses.find(e => e.id === selectedCategory);
    const newExpenseAmount = +expenseAmount;

    if (balance - newExpenseAmount < 0) {
      toast.error("Cannot add expense: Insufficient funds. Your balance would become negative.");
      return;
    }

    const newExpense = {
      color: expense.color,
      title: expense.title,
      total: expense.total + newExpenseAmount,
      items: [
        ...expense.items,
        {
          amount: newExpenseAmount,
          createdAt: new Date(),
          id: uuidv4(),
        },
      ],
    };

    try {
      await addExpenseItem(selectedCategory, newExpense);
      setExpenseAmount("");
      setSelectCategory(null);
      onClose();
      toast.success('Expense Item Added');
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const addCategoryHandler = async () => {
    const title = titleRef.current.value;
    const color = colorRef.current.value;

    try {
      await addCategory({ title, color, total: 0 });
      setShowAddExpense(false);
      toast.success('Category created');
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-6 bg-[#F5F7FA] p-6 min-h-[60vh] max-h-[90vh] overflow-y-auto">
        {/* Amount Input Section */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-semibold">Enter an Amount:</label>
          <input
            type="number"
            min={1}
            step={1}
            placeholder="Enter expense amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className="px-4 py-2 bg-[#1B1F3B] text-white rounded-xl placeholder-gray-300"
          />
        </div>

        {/* Expense Category Section */}
        {expenseAmount > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 capitalize">
                Select expense category
              </h3>
              <button
                onClick={() => setShowAddExpense(true)}
                className="btn btn-primary text-sm"
              >
                + New Category
              </button>
            </div>

            {showAddExpense && (
              <div className="flex items-center gap-12 flex-wrap">
                <input
                  type="text"
                  placeholder="Enter title"
                  ref={titleRef}
                  className="px-4 py-2 bg-[#1B1F3B] text-white rounded-xl placeholder-gray-300"
                />
                <input
                  type="color"
                  className="w-14 h-10 rounded-xl cursor-pointer"
                  ref={colorRef}
                />
                <button
                  onClick={addCategoryHandler}
                  className="btn btn-primary text-sm"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="btn btn-danger text-sm"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Category List (No Inner Scrolling) */}
            <div className="flex flex-col gap-2">
              {expenses.map(expense => (
                <button
                  key={expense.id}
                  onClick={() => setSelectCategory(expense.id)}
                >
                  <div
                    style={{
                      boxShadow: expense.id === selectedCategory ? "1px 1px 4px rgba(0,0,0,0.2)" : "none",
                    }}
                    className="flex items-center justify-between px-3 py-2 bg-[#1B1F3B] text-white rounded-xl hover:bg-[#4A90E2] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: expense.color }}
                      />
                      <h4 className="capitalize text-sm">{expense.title}</h4>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Expense Button */}
        {expenseAmount > 0 && selectedCategory && (
          <div className="mt-4">
            <button
              className="btn btn-primary w-full"
              onClick={addExpenseItemHandler}
            >
              Add Expense
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AddExpenseModal;