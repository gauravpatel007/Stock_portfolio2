import { useState, useEffect, useRef } from "react";
import { Plus, X, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function HoldingForm({
  setHoldings,
  editHolding = null,
  isEditing = false,
  onCloseEditModal,
  triggerNotificationRefresh,
}) {
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [sector, setSector] = useState("Other");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Optional Price Alert Fields
  const [setAlert, setSetAlert] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState("ABOVE");
  const [alertFrequency, setAlertFrequency] = useState("EVERY_TIME");

  // Open modal if isEditing changes
  useEffect(() => {
    if (isEditing && editHolding) {
      setSymbol(editHolding.symbol || "");
      setQuantity(editHolding.quantity || "");
      setAvgPrice(editHolding.avgPrice || "");
      setCurrentPrice(editHolding.currentPrice || "");
      setSector(editHolding.sector || "Other");
      setShowModal(true);
    }
  }, [isEditing, editHolding]);

  const handleClose = () => {
    setShowModal(false);
    setSymbol("");
    setQuantity("");
    setAvgPrice("");
    setCurrentPrice("");
    setSector("Other");
    setSearchResults([]);
    setShowDropdown(false);
    setSetAlert(false);
    setAlertTargetPrice("");
    if (onCloseEditModal) onCloseEditModal();
  };

  const handleSave = async () => {
    if (!symbol || !quantity || !avgPrice || !currentPrice) {
      alert("Please fill all required fields.");
      return;
    }

    const holdingData = {
      symbol: symbol.toUpperCase(),
      quantity: Number(quantity),
      avgPrice: Number(avgPrice),
      currentPrice: Number(currentPrice),
      sector,
    };

    try {
      if (isEditing && editHolding) {
        // PUT update
        const response = await fetch(`http://localhost:5000/api/holdings/${editHolding._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(holdingData),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to update holding");
        }
        const updated = await response.json();

        setHoldings((prev) =>
          prev.map((h) => (h._id === editHolding._id ? updated : h))
        );
      } else {
        // POST create
        const response = await fetch("http://localhost:5000/api/holdings", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(holdingData),
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to add holding");
        }
        const savedHolding = await response.json();

        setHoldings((prev) => [...prev, savedHolding]);
      }

      // Optional Watchlist / Alert Creation
      if (setAlert && alertTargetPrice) {
        try {
          await fetch("http://localhost:5000/api/watchlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              symbol: symbol.toUpperCase(),
              targetPrice: Number(alertTargetPrice),
              condition: alertCondition,
              frequency: alertFrequency,
            }),
          });
          if (triggerNotificationRefresh) triggerNotificationRefresh();
        } catch (e) {
          console.error("Error creating optional alert:", e);
        }
      }

      handleClose();
    } catch (error) {
      console.error(error);
      alert(`Error saving holding: ${error.message}`);
    }
  };

  const handleSymbolChange = (e) => {
    const val = e.target.value;
    setSymbol(val);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (val.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/holdings/search/${val}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.quotes) {
              setSearchResults(data.quotes.filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND'));
              setShowDropdown(true);
            }
          }
        } catch (error) {
          console.error("Search error", error);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            handleClose();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer transition shadow-sm"
        >
          + Add Holding
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleClose}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-[480px] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              {isEditing ? "Edit Holding" : "Add New Holding"}
            </h2>

            <div className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. RELIANCE, TCS, AAPL"
                  value={symbol}
                  onChange={handleSymbolChange}
                  onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                  className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer border-b last:border-0 border-slate-100 dark:border-slate-600 transition-colors"
                        onClick={() => {
                          setSymbol(result.symbol);
                          setSector(result.sector || result.industry || "Other");
                          setShowDropdown(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-slate-900 dark:text-white">{result.symbol}</div>
                          <div className="text-[10px] bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            {result.sector || result.industry || "Other"}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {result.shortname || result.longname}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Average Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(e.target.value)}
                    className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Current Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Price Alert Option */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    checked={setAlert}
                    onChange={(e) => setSetAlert(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Bell className="w-4 h-4 text-blue-600" /> Set Price Target Alert (Optional)
                </label>

                {setAlert && (
                  <div className="mt-3 p-4 bg-blue-50/60 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Alert Target Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 3000"
                        value={alertTargetPrice}
                        onChange={(e) => setAlertTargetPrice(e.target.value)}
                        className="w-full bg-white dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Condition
                        </label>
                        <select
                          value={alertCondition}
                          onChange={(e) => setAlertCondition(e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm"
                        >
                          <option value="ABOVE">Price ≥ Target</option>
                          <option value="BELOW">Price ≤ Target</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Frequency
                        </label>
                        <select
                          value={alertFrequency}
                          onChange={(e) => setAlertFrequency(e.target.value)}
                          className="w-full bg-white dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm"
                        >
                          <option value="EVERY_TIME">Every Time</option>
                          <option value="ONCE">Only Once</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer shadow-sm"
              >
                {isEditing ? "Update Holding" : "Save Holding"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HoldingForm;