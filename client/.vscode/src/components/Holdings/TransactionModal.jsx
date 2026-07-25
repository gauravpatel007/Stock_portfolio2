import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config";

function TransactionModal({ holding, onClose, setHoldings, onTransactionSuccess }) {
  const { token } = useAuth();
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleTransaction = async (type) => {
    if (!quantity || !price) {
      alert("Please fill both quantity and price");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/holdings/${holding._id}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to process transaction");
      }

      const updatedHolding = await response.json();

      if (updatedHolding.message === "Holding sold completely and removed") {
        setHoldings((prev) => prev.filter((h) => h._id !== holding._id));
      } else {
        setHoldings((prev) => prev.map((h) => (h._id === holding._id ? updatedHolding : h)));
      }

      onClose();
      if (onTransactionSuccess) onTransactionSuccess();
    } catch (error) {
      console.error(error);
      alert(`Error processing transaction: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-[400px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
          Transaction - {holding.symbol}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Quantity
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 150.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleTransaction("SELL")}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer transition shadow-sm text-lg"
          >
            Sell
          </button>
          <button
            onClick={() => handleTransaction("BUY")}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer transition shadow-sm text-lg"
          >
            Buy
          </button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
