import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Geolocation } from "@capacitor/geolocation";
import "./App.css";

const App: React.FC = () => {
  const [celsius, setCelsius] = useState<string>("");
  const [fahrenheit, setFahrenheit] = useState<number | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  // Chuyển đổi nhiệt độ từ °C sang °F
  const convertTemperature = () => {
    if (!celsius.trim()) return;

    const celsiusValue = parseFloat(celsius);
    if (isNaN(celsiusValue)) {
      alert("Vui lòng nhập một số hợp lệ!");
      return;
    }

    const f = (celsiusValue * 9) / 5 + 32;
    setFahrenheit(f);
    sendNotification(f);
  };

  // Gửi thông báo nhiệt độ với Capacitor LocalNotifications
  const sendNotification = async (temperature: number) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Chuyển đổi nhiệt độ",
            body: `Nhiệt độ chuyển đổi: ${temperature.toFixed(2)}°F`,
            id: new Date().getTime(), // Tạo ID duy nhất
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
    }
  };

  // Chia sẻ kết quả với Capacitor Share API
  const shareResult = async () => {
    if (fahrenheit !== null) {
      try {
        await Share.share({
          title: "Chia sẻ nhiệt độ",
          text: `Nhiệt độ sau khi chuyển đổi: ${fahrenheit.toFixed(2)}°F!`,
          dialogTitle: "Chia sẻ kết quả",
        });
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
      }
    }
  };

  // Lấy vị trí hiện tại bằng Capacitor Geolocation API
  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setLocation(
        `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`
      );
    } catch (error) {
      console.error("Lỗi khi lấy vị trí:", error);
      alert("Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập GPS!");
    }
  };

  return (
    <div className="app-container">
      <h1>Chuyển đổi nhiệt độ</h1>
      <input
        type="number"
        placeholder="Nhập nhiệt độ (°C)"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      <button onClick={convertTemperature}>Chuyển đổi</button>

      {fahrenheit !== null && <h2>{fahrenheit.toFixed(2)}°F</h2>}

      <button onClick={shareResult}>Chia sẻ kết quả</button>
      <button onClick={getCurrentLocation}>Lấy vị trí</button>

      {location && <p className="location-info">{location}</p>}
    </div>
  );
};

export default App;
