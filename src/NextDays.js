import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function NextDays({ coords }) {
  const [forecast, setForecast] = useState([]);

  let days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
  function displayForecast(response) {
    let list = response.data.list;

    let currentDays = {};
    list.forEach((item) => {
      let day = days[new Date(Date.parse(item.dt_txt)).getDay()];
      if (!currentDays[day]) {
        currentDays[day] = {
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          items: [item],
        };
      } else {
        currentDays[day] = {
          tempMax: Math.max(item.main.temp_max, currentDays[day].tempMax),
          tempMin: Math.min(item.main.temp_min, currentDays[day].tempMin),
          items: currentDays[day].items.concat(item),
        };
      }
    });
    function getImageUrl(iconCode) {
      return "http://openweathermap.org/img/w/" + iconCode + ".png";
    }

    setForecast(
      Object.keys(currentDays).map(function (day) {
        let tempMax = Math.round(currentDays[day].tempMax);
        let tempMin = Math.round(currentDays[day].tempMin);
        let items = currentDays[day].items;
        let middleItem = items[Math.floor(items.length / 2)];
        let iconCode = middleItem.weather[0].icon;

        var iconUrl = getImageUrl(iconCode);
        return {
          iconUrl,
          tempMax,
          tempMin,
          day,
        };
      })
    );
  }

  const getForecast = useCallback(function getForecast(coords) {
    let { lat: latitude, lon: longitude } = coords;
    let units = "metric";
    let apiKey = "12b765e58ad1df7247a7dd8bf64421e7";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/forecast";
    let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayForecast);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("coords", coords);
    if (!coords) return;
    getForecast(coords);
  }, [coords, getForecast]);

  return (
    <div>
      <h1>Next Days</h1>
      <div className="weather-forecast row" id="forecast">
        {forecast.map(({ day, tempMax, tempMin, iconUrl }, index) => (
          <div className="col-2" key={index}>
            <div className="weather-forecast-date">{day}</div>

            <img src={iconUrl} alt="forecastIcont" />
            <br />
            <div className="weather-forecast-temperatures">
              <span className="weather-forecast-temperature-max">
                {tempMax}°{" "}
              </span>
              <span className="weather-forecast-temperature-min">
                {tempMin}°{" "}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
