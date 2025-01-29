import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import Card from "./Card";
import { WiSolarEclipse, WiHumidity, WiThermometer, WiBarometer } from "react-icons/wi";
import { FaSeedling, FaWater, FaGasPump } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    solarPower: 0,
    soilMoisture1: 0,
    soilMoisture2: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    gas: 0,
    pumpPower: 0,
    dripperPower: 0,
  });

  const [button1State, setButton1State] = useState(false);
  const [button2State, setButton2State] = useState(false);

  // Fetch data for each sensor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const temperature = await axios.get("https://green-house-server-53a4.onrender.com/temperature");
        const humidity = await axios.get("https://green-house-server-53a4.onrender.com/humidity");
        const gas = await axios.get("https://green-house-server-53a4.onrender.com/gas");
        const pressure = await axios.get("https://green-house-server-53a4.onrender.com/pressure");
        const solarPower = await axios.get("https://green-house-server-53a4.onrender.com/solarPower");
        const soilMoisture1 = await axios.get("https://green-house-server-53a4.onrender.com/soilMoisture1");
        const soilMoisture2 = await axios.get("https://green-house-server-53a4.onrender.com/soilMoisture2");
        const pumpPower = await axios.get("https://green-house-server-53a4.onrender.com/pumpPower");
        const dripperPower = await axios.get("https://green-house-server-53a4.onrender.com/dripperPower");

        setData({
          temperature: temperature.data.temperature,
          humidity: humidity.data.humidity,
          gas: gas.data.gas,
          pressure: pressure.data.pressure,
          solarPower: solarPower.data.solarPower,
          soilMoisture1: soilMoisture1.data.soilMoisture1,
          soilMoisture2: soilMoisture2.data.soilMoisture2,
          pumpPower: pumpPower.data.pumpPower,
          dripperPower: dripperPower.data.dripperPower,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle Button 1 ON/OFF
  const handleButton1 = async (state) => {
    try {
      await axios.post("https://green-house-server-53a4.onrender.com/buttons", { button: 1, state: state });
      setButton1State(state);
    } catch (error) {
      console.error("Error sending button1 state:", error);
    }
  };

  // Handle Button 2 ON/OFF
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
        <h1 className="title">Greenhouse Monitoring Dashboard</h1>
      </header>

      <div className="grid-container">
        {/* Sensor Cards */}
        <Card title="Solar Power" value={`${data.solarPower} W`} icon={<WiSolarEclipse size={50} />} />
        <Card title="Soil Moisture 1" value={`${data.soilMoisture1} %`} icon={<FaSeedling size={50} />} />
        <Card title="Soil Moisture 2" value={`${data.soilMoisture2} %`} icon={<FaSeedling size={50} />} />
        <Card title="Temperature" value={`${data.temperature} °C`} icon={<WiThermometer size={50} />} />
        <Card title="Humidity" value={`${data.humidity} %`} icon={<WiHumidity size={50} />} />
        <Card title="Pressure" value={`${data.pressure} hPa`} icon={<WiBarometer size={50} />} />
        <Card title="Gas" value={`${data.gas} ppm`} icon={<FaGasPump size={50} />} />
        <Card title="Pump Power" value={`${data.pumpPower} W`} icon={<FaWater size={50} />} />
        <Card title="Dripper Power" value={`${data.dripperPower} W`} icon={<FaWater size={50} />} />
      </div>

      {/* Buttons */}
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
