import React, { useEffect, useState } from "react";
import axios from "axios";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

export default function WeatherSearch() {
  const [city, setCity] = useState("Kharkiv");
  const [weather, setWeather] = useState({});
  let [temperature, setTemperature] = useState(5);
  let weekDay = getWeekDay(new Date());
  let curentTime = getCurrentTime();
  console.log(weather);
  function displayWeather(response) {
    setWeather({
      temperature: Math.round(response.data.main.temp),
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description,
    });
    setCity(response.data.name);
  }
  function getCurrentTime() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (minutes < 10) return `${hours}:0${minutes}`;
    return `${hours}:${minutes}`;
  }

  function getWeekDay(date) {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }
  function convertToFahrenheit(event) {
    event.preventDefault();
    setTemperature((Math.round(weather.temperature * 9) / 5) * 32);
  }

  function convertToCelsius(event) {
    event.preventDefault();
    setTemperature(weather.temperature);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let apiKey = "094780c710fa4efd669f0df8c3991927";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
  }

  function retrievePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let units = "metric";
    let apiKey = "12b765e58ad1df7247a7dd8bf64421e7";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayWeather);
  }
  useEffect(getCurrentPosition, []);
  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(retrievePosition);
  }
  function updateCity(event) {
    setCity(event.target.value);
  }

  let form = (
    <form onSubmit={handleSubmit} className="form-inline">
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search a city"
        onChange={updateCity}
        aria-label="Search"
        id="city-input"
      />
      <button className="btn btn-primary my-2 my-sm-0" type="submit">
        Search
      </button>
      <button
        className="btn btn-success my-2 my-sm-0 ml-3"
        type="button"
        onClick={getCurrentPosition}
        id="current-location-button"
      >
        Current
      </button>
    </form>
  );

  return (
    <>
      <div className="container">
        <nav className="navbar navbar-light">
          {form}
          <button
            className="navbar-brand btn"
            id="navbar-kh"
            onClick={(e) => {
              setCity("Kharkov");
              handleSubmit(e);
            }}
          >
            Kharkov
          </button>
          <button
            className="navbar-brand"
            id="navbar-lv"
            onClick={(e) => {
              setCity("Lviv");
              handleSubmit(e);
            }}
          >
            Lviv
          </button>
          <button
            className="navbar-brand"
            id="navbar-od"
            onClick={(e) => {
              setCity("Odessa");
              handleSubmit(e);
            }}
          >
            Odessa
          </button>
          <button
            className="navbar-brand"
            id="navbar-ky"
            onClick={(e) => {
              setCity("Kyiv");
              handleSubmit(e);
            }}
          >
            Kyiv
          </button>
        </nav>

        <div className="mt-5">
          <h1>Today in {city}</h1>
          <ul>
            <li>{weekDay}</li>
            <li>{curentTime}</li>
          </ul>
        </div>
        <div className="rawer">
          <div className="row">
            <div className="col-3 divider">
              <img className="imag-cast" id="imag-cast" />
            </div>
            <div className="col-3 divider">
              <h4 className="px-3 py-1 fs-1 fs-bold vellu d-flex align-items-center">
                <div className="flexBox">
                  <span className="temperature" id="temperature">
                    {temperature}
                  </span>
                  <span className="units">
                    <a href="/" onClick={convertToCelsius}>
                      °C
                    </a>
                    |
                    <a href="/" onClick={convertToFahrenheit}>
                      °F
                    </a>
                  </span>
                </div>
              </h4>
              <p id="description" className="px-1 fs-6 mt-1 fw-lighter Shower">
                {weather.description}
              </p>
            </div>
            <div className="col-3">
              <h4 className="text-center px-1 fs-6 fw-lighter mt-3 Humidity">
                <li>
                  Humidity: <span id="humidity">{weather.humidity}</span>%
                </li>
                <br />
                <li>
                  Wind: <span id="wind">{weather.wind}</span> km/h
                </li>
              </h4>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
        <video className="video-bg" loop autoPlay muted>
          <source src="video/pexels-nebo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h1>Next Days</h1>

      <div className="weather-forecast" id="forecast"></div>
      <footer>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-github"
          viewBox="0 0 16 16"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <a className="githubLink" href="https://github.com/Polchaninova/home">
          Github
        </a>
      </footer>
    </>
  );
}
