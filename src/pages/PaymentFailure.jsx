import React from 'react'
import { Link, useLocation } from 'react-router-dom'
const PaymentFailure = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const orderId = query.get('orderId');
    const transactionId = query.get('transaction_Id');
    const paymentMethod = query.get('payment_mode');
    const date = query.get('transaction_date');
   return (
    <div className='container mx-auto text-center mt-10'>
      <h1 className='text-3xl font-bold text-[#de9400] mb-4'>Transaction Failed</h1>

      <div className='bg-gray-100 shadow-md rounded p-5 inline-block mt-5 text-left'>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Transaction ID:</strong> {transactionId}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Date & Time:</strong> {decodeURIComponent(date)}</p>
      </div>

      <div className='mt-6'>
        <Link to={"/"}>
        <button className='text-white bg-[#de9400] rounded-md p-2 mb-5' >Return to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure
