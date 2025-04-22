import React, { useState } from "react";
import "./TransactionStyles.css";

const initialTransactions = [
  { name: "Paris Milton", bookingCode: "CN-KL2345", airline: "Shaqipe Airlines", route: "CDG-JFK", billingDate: "2025-07-01", amount: "$500.00", status: "Confirmed" },
  { name: "Elena Winston", bookingCode: "QW-MN6789", airline: "Shaqipe Airlines", route: "HKG-LAX", billingDate: "2025-07-01", amount: "$750.00", status: "Pending" },
  { name: "Roger Piston", bookingCode: "SH-OP3456", airline: "Shaqipe Airlines", route: "FRA-BKK", billingDate: "2025-07-01", amount: "$650.00", status: "Confirmed" },
  { name: "Paula Ortega", bookingCode: "FF-QR7890", airline: "Shaqipe Airways", route: "LAX-HND", billingDate: "2025-07-01", amount: "$800.00", status: "Cancelled" },
  { name: "Jackie Long", bookingCode: "AJ-ST0123", airline: "Shaqipe Airlines", route: "SIN-LHR", billingDate: "2025-07-01", amount: "$900.00", status: "Confirmed" },
  { name: "Oscar Bolster", bookingCode: "SH-AB1234", airline: "Shaqipe Airlines", route: "NYC-LAX", billingDate: "2025-07-01", amount: "$350.00", status: "Confirmed" },
  { name: "Yuri Wakamura", bookingCode: "FF-CD5678", airline: "Shaqipe Airline", route: "LHR-JFK", billingDate: "2025-07-01", amount: "$450.00", status: "Pending" },
  { name: "Santo Reagan", bookingCode: "AJ-EF9101", airline: "Shaqipe Airlines", route: "HND-SFO", billingDate: "2025-07-01", amount: "$700.00", status: "Confirmed" },
  { name: "Vicky Wisteria", bookingCode: "NA-GH2345", airline: "Shaqipe Airlines", route: "SYD-SIN", billingDate: "2025-07-01", amount: "$400.00", status: "Cancelled" },
  { name: "Adam Stewart", bookingCode: "JS-UI6789", airline: "Shaqipe Airlines", route: "DXB-LHR", billingDate: "2025-07-01", amount: "$600.00", status: "Confirmed" },
  { name: "Marcus Levin", bookingCode: "FF-MN5678", airline: "Shaqipe Airlines", route: "LAX-HND", billingDate: "2025-07-01", amount: "$900.00", status: "Pending" },
  { name: "Lindsey Carder", bookingCode: "AJ-WX3456", airline: "Shaqipe Airlines", route: "SIN-FRA", billingDate: "2025-07-01", amount: "$750.00", status: "Confirmed" },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Confirmed": return "badge badge-confirmed";
    case "Pending": return "badge badge-pending";
    case "Cancelled": return "badge badge-cancelled";
    default: return "badge";
  }
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState(initialTransactions);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...transactions];
    updated[index].status = newStatus;
    setTransactions(updated);
  };

  return (
    <div className="transaction">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Booking Code</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Billing Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Change Status</th>
              
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.name}</td>
                <td>{tx.bookingCode}</td>
                <td>{tx.airline}</td>
                <td>{tx.route}</td>
                <td>{tx.billingDate}</td>
                <td>{tx.amount}</td>
                <td><span className={getStatusClass(tx.status)}>{tx.status}</span></td>
                <td>
                <select
                    value={tx.status}
                    className={`select-status status-${tx.status.toLowerCase()}`}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    >
                    <option value="Confirmed" className="select-status status-confirmed">Confirmed</option>
                    <option value="Pending" className="select-status status-pending">Pending</option>
                    <option value="Cancelled" className="select-status status-cancelled">Cancelled</option>
                </select>

                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
