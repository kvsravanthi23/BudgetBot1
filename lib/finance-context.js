"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { authContext } from "./store/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const FinanceContext = createContext({
  income: [],
  expenses: [],
  balance: 0,
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const { user } = useContext(authContext);

  useEffect(() => {
    const newBalance =
      income.reduce((total, i) => total + i.amount, 0) -
      expenses.reduce((total, e) => total + e.total, 0);
    setBalance(newBalance);
  }, [income, expenses]);

  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });
      setExpenses((prevExpenses) => [
        ...prevExpenses,
        {
          id: docSnap.id,
          uid: user.uid,
          items: [],
          ...category,
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  const addExpenseItem = async (expenseCategoryId, newExpense) => {
    const docRef = doc(db, "expenses", expenseCategoryId);
    try {
      await updateDoc(docRef, { ...newExpense });
      setExpenses((prevState) => {
        const updateExpenses = [...prevState];
        const foundIndex = updateExpenses.findIndex(
          (expense) => expense.id === expenseCategoryId
        );
        updateExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };
        return updateExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, { ...updatedExpense });
      setExpenses((prevExpenses) => {
        const updatedExpenses = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId
        );
        if (pos !== -1) {
          updatedExpenses[pos].items = updatedExpense.items;
          updatedExpenses[pos].total = updatedExpense.total;
        }
        return updatedExpenses;
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseCategoryId)
      );
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const addIncomeItem = async (newIncome) => {
    const collectionRef = collection(db, "income");
    try {
      const docSnap = await addDoc(collectionRef, {
        ...newIncome,
        uid: user.uid,
        createdAt: Timestamp.now(),
      });
      setIncome((prevState) => [
        ...prevState,
        {
          id: docSnap.id,
          ...newIncome,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const removeIncomeItem = async (incomeId) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) => prevState.filter((i) => i.id !== incomeId));
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (!user) return;

    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      const q = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(q);
      const data = docsSnap.docs.map((doc) => {
        const docData = doc.data();
        let createdAt;

        if (docData.createdAt && typeof docData.createdAt.toMillis === "function") {
          createdAt = new Date(docData.createdAt.toMillis());
        } else if (docData.createdAt && typeof docData.createdAt === "string") {
          createdAt = new Date(docData.createdAt);
        } else {
          createdAt = new Date();
        }

        return {
          id: doc.id,
          ...docData,
          createdAt,
        };
      });
      setIncome(data);
    };

    const getExpensesData = async () => {
      const collectionRef = collection(db, "expenses");
      const q = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(q);
      const data = docsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

  const values = {
    income,
    expenses,
    balance,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };

  return (
    <FinanceContext.Provider value={values}>
      {children}
    </FinanceContext.Provider>
  );
}