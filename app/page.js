"use client";

import { useState, useContext, useEffect } from 'react';
import { currencyFormatter } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import AddIncomeModal from '@/components/modals/AddIncomeModal';
import ExpenseCategoryItem from '@/components/ExpenseCategoryitem'; 
import { FinanceContext } from '@/lib/finance-context';
import { authContext } from '@/lib/store/auth-context';
import AddExpenseModal from '@/components/modals/AddExpenseModal';
import SignIn from '@/components/modals/SignIn';
import FinancialChatbot from "@/components/FinancialChatBot";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export default function Home() {
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [balance, setBalance] = useState(0);

  const { expenses, income } = useContext(FinanceContext);
  const { user } = useContext(authContext);

  useEffect(() => {
    const newBalance = income.reduce((total, i) => total + i.amount, 0) - expenses.reduce((total, e) => total + e.total, 0);
    setBalance(newBalance);
  }, [expenses, income]);

  if (!user) {
    return <SignIn />;
  }

  const expenseLabels = expenses.map(expense => expense.title);
  const expenseData = expenses.map(expense => expense.total);
  const expenseColors = expenses.map(expense => expense.color);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
  };

  return (
    <>
      <AddIncomeModal show={showAddIncomeModal} onClose={setShowAddIncomeModal} income={[]} />
      <AddExpenseModal show={showAddExpenseModal} onClose={setShowAddExpenseModal} income={[]} />

      <main className="container max-w-2xl py-6 mx-auto">
        <section>
          <small className="text-grey-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button onClick={() => setShowAddExpenseModal(true)} className="btn btn-primary">+ Expenses</button>
          <button onClick={() => setShowAddIncomeModal(true)} className="btn btn-primary">+ Income</button>
        </section>

        <section className="py-6">
          <h3 className="text-2xl">My Expenses</h3>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {expenses.map(expense => (
              <ExpenseCategoryItem key={expense.id} expense={expense} />
            ))}
          </div>
        </section>

        {/* Charts Section - Slider */}
        <section className="py-6 px-6">
          <h3 className="text-2xl" id="Stats">Stats</h3>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            className="mt-6"
          >
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-80">
                <h1 className="text-center mb-4">Doughnut Chart</h1>
                <div className="chart-container">
                  <Doughnut
                    data={{ labels: expenseLabels, datasets: [{ label: "Expenses", data: expenseData, backgroundColor: expenseColors, borderWidth: 2 }] }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-80">
                <h1 className="text-center mb-4">Pie Chart</h1>
                <div className="chart-container">
                  <Pie
                    data={{ labels: expenseLabels, datasets: [{ label: "Expenses", data: expenseData, backgroundColor: expenseColors, borderWidth: 1 }] }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-80">
                <h1 className="text-center mb-4">Bar Chart</h1>
                <div className="chart-container">
                  <Bar
                    data={{ labels: expenseLabels, datasets: [{ label: "Expenses", data: expenseData, backgroundColor: expenseColors, borderWidth: 1 }] }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-80">
                <h1 className="text-center mb-4">Line Chart</h1>
                <div className="chart-container">
                  <Line
                    data={{ labels: expenseLabels, datasets: [{ label: "Expenses Over Time", data: expenseData, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 }] }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </SwiperSlide>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        </section>

        <h3 className="text-2xl" id="Search"></h3>
        <section className="px-4 py-8">
          <FinancialChatbot />
        </section>
      </main>
    </>
  );
}