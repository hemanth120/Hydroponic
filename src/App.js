import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import Card from "./Card";
import { FaTemperatureHigh, FaTint, FaFlask, FaBolt } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    ph: 0,
    ec: 0,
  });

  const [button1State, setButton1State] = useState(false);
  const [button2State, setButton2State] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temperature = await axios.get("https://green-house-server-53a4.onrender.com/temp");
        const humidity = await axios.get("https://green-house-server-53a4.onrender.com/humid");
        const ph = await axios.get("https://green-house-server-53a4.onrender.com/ph");
        const ec = await axios.get("https://green-house-server-53a4.onrender.com/ec");

        setData({
          temperature: temperature.data.temperature,
          humidity: humidity.data.humidity,
          ph: ph.data.ph,
          ec: ec.data.ec,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButton1 = async (state) => {
    try {
      await axios.post("https://green-house-server-53a4.onrender.com/buttons", { button: 1, state: state });
      setButton1State(state);
    } catch (error) {
      console.error("Error sending button1 state:", error);
    }
  };

  const handleButton2 = async (state) => {
    try {
      await axios.post("https://green-house-server-53a4.onrender.com/buttons", { button: 2, state: state });
      setButton2State(state);
    } catch (error) {
      console.error("Error sending button2 state:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="text-center">
        <h1 className="title">HYDROPONIC</h1>
      </header>

      <div className="grid-container">
        <Card title="Temperature" value={`${data.temperature} °C`} icon={<FaTemperatureHigh size={50} />} />
        <Card title="Humidity" value={`${data.humidity} %`} icon={<FaTint size={50} />} />
        <Card title="pH Level" value={`${data.ph} pH`} icon={<FaFlask size={50} />} />
        <Card title="EC" value={`${data.ec} ppm`} icon={<FaBolt size={50} />} />
      </div>

      <div className="button-container">
        <Button onClick={() => handleButton1(!button1State)}>
          {button1State ? "Turn Off Button 1" : "Turn On Button 1"}
        </Button>
        <Button onClick={() => handleButton2(!button2State)}>
          {button2State ? "Turn Off Button 2" : "Turn On Button 2"}
        </Button>
      </div>
    </div>
  );
};

export default App;
