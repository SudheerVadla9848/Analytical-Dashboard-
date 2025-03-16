"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChartIcon, SearchIcon } from "lucide-react";
import { Line, Bar, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_KEY = "84c37fa114664031bab666be230b59d"; 
const STOCK_SYMBOLS = ["AAPL", "GOOGL", "TSLA", "MSFT", "AMZN"];

interface StockData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export function FinanceWidget() {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const fetchStockData = async (stockSymbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=60min&apikey=${API_KEY}`
      );
      const result = await res.json();
      const timeSeries = result["Time Series (60min)"];

      if (!timeSeries) {
        setError("Failed to load stock data.");
        setLoading(false);
        return;
      }

      const formattedData = Object.entries(timeSeries)
        .slice(0, 10)
        .map(([time, values]: any) => ({
          time: new Date(time).toLocaleTimeString(),
          price: parseFloat(values["1. open"]),
        }))
        .reverse();

      setData(formattedData);
    } catch (err) {
      setError("Error fetching stock data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol]);

  return (
    <motion.div
      initial={{ backgroundColor: "#1a202c" }}
      animate={{ backgroundColor: ["#1a202c", "#2d3748", "#4a5568", "#2d3748", "#1a202c"] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      className="flex justify-center "
    >
      <Card className="max-w-[500px] max-h-[500px] bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-lg p-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Finance: {symbol}</CardTitle>
          <LineChartIcon className="h-5 w-5 text-white" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex  space-x-2 mb-4">
            <input
              type="text"
              placeholder="Search stock symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              className="border px-3 py-2 rounded-md w-full text-black"
            />
            <button
              onClick={() => search && setSymbol(search)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md flex items-center hover:bg-yellow-600 transition-all"
            >
              <SearchIcon className="h-5 w-5 mr-1" />
              Search
            </button>
          </div>

          {/* Centered Stock Type Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {STOCK_SYMBOLS.map((stock) => (
              <button
                key={stock}
                onClick={() => setSymbol(stock)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  symbol === stock ? "bg-yellow-500 text-black" : "bg-gray-300 hover:bg-gray-400 text-black"
                }`}
              >
                {stock}
              </button>
            ))}
          </div>

          {/* Error Message (Centered & Inside Block) */}
          {error && (
            <p className="text-center text-red-500 text-sm w-full">
              {error}
            </p>
          )}

          {/* Chart Section */}
          {loading ? (
            <p className="text-center text-white">Loading stock data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={100}>
              <ComposedChart data={data}>
                <XAxis dataKey="time" stroke="#ffffff" />
                <YAxis domain={["auto", "auto"]} stroke="#ffffff" />
                <Tooltip contentStyle={{ backgroundColor: "#2d3748", color: "#ffffff" }} />
                <Bar dataKey="price" fill="#ffd700" />
                <Line type="monotone" dataKey="price" stroke="#ffffff" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
