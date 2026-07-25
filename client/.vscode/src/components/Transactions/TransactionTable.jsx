function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Transaction History</h2>
        <p className="text-slate-500 dark:text-slate-400">No transaction history found for your account yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Transaction History
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-slate-700 text-left text-slate-500 dark:text-slate-400">
            <th className="pb-4">Date</th>
            <th className="pb-4">Type</th>
            <th className="pb-4">Symbol</th>
            <th className="pb-4">Quantity</th>
            <th className="pb-4">Price</th>
            <th className="pb-4">Value</th>
          </tr>
        </thead>

        <tbody className="text-slate-700 dark:text-slate-300">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <td className="py-4">{transaction.date}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    transaction.type === "BUY"
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>

              <td className="font-semibold text-slate-900 dark:text-white">
                {transaction.symbol}
              </td>

              <td>{transaction.quantity}</td>

              <td>
                ₹{transaction.price.toLocaleString()}
              </td>

              <td className="font-semibold">
                ₹
                {(
                  transaction.quantity *
                  transaction.price
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;