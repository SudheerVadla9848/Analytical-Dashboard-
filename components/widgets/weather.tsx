"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChartIcon, SearchIcon, Sun, CloudRain, Cloud, Snowflake } from "lucide-react";

interface WeatherData {
  date: string;
  maxTemp: number;
  minTemp: number;
  icon: string;
}

const TOP_CITIES = [
  "Mumbai", "Lucknow", "Kolkata", "Patna", "Chennai",
  "Bhopal", "Jaipur", "Bangalore", "Ahmedabad", "Medak",
];

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load dotLottie script dynamically
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "01d":
      case "01n":
        return <Sun className="text-yellow-400 h-5 w-5" />;
      case "02d":
      case "02n":
        return <Cloud className="text-gray-400 h-5 w-5" />;
      case "09d":
      case "09n":
        return <CloudRain className="text-blue-400 h-5 w-5" />;
      case "13d":
      case "13n":
        return <Snowflake className="text-blue-300 h-5 w-5" />;
      default:
        return <Cloud className="text-gray-500 h-5 w-5" />;
    }
  };

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = "7c335cf9349247b1886e99b0575c7ac8"; // Replace with your API key
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.list) {
        setError(`Invalid city: ${city}. Please try again.`);
        setLoading(false);
        return;
      }

      // Process data to get daily min/max temperatures with weather icons
      const dailyData: { [date: string]: { max: number[]; min: number[]; icon: string[] } } = {};
      data.list.forEach((entry: any) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date (YYYY-MM-DD)
        if (!dailyData[date]) dailyData[date] = { max: [], min: [], icon: [] };
        dailyData[date].max.push(entry.main.temp_max);
        dailyData[date].min.push(entry.main.temp_min);
        dailyData[date].icon.push(entry.weather[0].icon);
      });

      // Compute max & min temp per day and pick the most common weather icon
      const formattedData = Object.entries(dailyData)
        .slice(0, 5)
        .map(([date, temps]) => ({
          date: new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          maxTemp: Math.max(...temps.max),
          minTemp: Math.min(...temps.min),
          icon: temps.icon.sort((a, b) => temps.icon.filter(v => v === a).length - temps.icon.filter(v => v === b).length).pop()!,
        }));

      setWeatherData(formattedData);
      setSelectedCity(city);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Inline Live Animation Background */}
      <div className="absolute inset-0 z-0 flex justify-center items-center opacity-30">
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <dotlottie-player
                src="https://lottie.host/d7eed687-3cd0-4daa-86bc-a37b637cdbdf/Tn77wPxxgF.lottie"
                background="transparent"
                speed="1"
                style="width: 500px; height: 500px"
                loop
                autoplay
              ></dotlottie-player>
            `,
          }}
        />
      </div>

      <Card className="relative z-10 bg-gray-900 bg-opacity-80 backdrop-blur-md text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">5-Day Weather Forecast</CardTitle>
          <LineChartIcon className="h-4 w-4 text-gray-300" />
        </CardHeader>
        <CardContent>
          {/* Search Box */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Enter city name..."
              className="border px-3 py-2 rounded-md w-full bg-gray-800 text-white placeholder-gray-400"
              onChange={(e) => setSelectedCity(e.target.value)}
            />
            <button
              onClick={() => fetchWeather(selectedCity)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-all"
            >
              <SearchIcon className="h-5 w-5 mr-1" />
              Search
            </button>
          </div>

          {/* Top Cities Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {TOP_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => fetchWeather(city)}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all ${
                  selectedCity === city
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Weather Table */}
          {loading ? (
            <p className="text-center text-gray-300">Fetching weather data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : weatherData.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2 text-center">{selectedCity}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-600 rounded-md">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border text-red-400">Max Temp (°C)</th>
                      <th className="p-2 border text-blue-400">Min Temp (°C)</th>
                      <th className="p-2 border">Weather</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-800">
                        <td className="p-2 border">{day.date}</td>
                        <td className="p-2 border text-red-400 font-semibold">{day.maxTemp}°C</td>
                        <td className="p-2 border text-blue-400 font-semibold">{day.minTemp}°C</td>
                        <td className="p-2 border flex justify-center">{getWeatherIcon(day.icon)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-300">Select a city to view the forecast.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
