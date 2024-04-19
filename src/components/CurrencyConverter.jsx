import { useState } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);

  const convertCurrency = async () => {
    try {
      const response = await axios.get(
        `http://currency.eba-qchvcgzv.us-east-1.elasticbeanstalk.com/convert?amount=${amount}&from_currency=${fromCurrency}&to_currency=${toCurrency}`
      );
      console.log(response.data);
      setConvertedAmount(response.data.converted_amount);
      setError(null);
    } catch (error) {
      setError("Error converting currency. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleConvertClick = () => {
    convertCurrency();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="mb-4">
        <label htmlFor="amountInput" className="block mb-2">
          Amount:
        </label>
        <input
          type="number"
          id="amountInput"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fromCurrencyInput" className="block mb-2">
          From Currency:
        </label>
        <input
          type="text"
          id="fromCurrencyInput"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="toCurrencyInput" className="block mb-2">
          To Currency:
        </label>
        <input
          type="text"
          id="toCurrencyInput"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <button
        onClick={handleConvertClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Convert
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {convertedAmount && (
        <p className="mt-2">
          Converted Amount: {convertedAmount} {toCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
