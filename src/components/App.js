import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "../styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  });

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
      }`;
    return date;
  };
  //new search function
  const search = async (event) => {
    // console.log("API Key:", process.env.REACT_APP_WEATHER_API_KEY);

    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      setWeather({ ...weather, loading: true });
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      await axios
        .get(url)
        .then((res) => {
          console.log("res", res);
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          console.log("error", error);
        });
    }
  };

  const fetchLocation = async (event) => {
    setQuery("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        }, (error) => {
          fetchDefaultLocationWeather()
        }
      )
    } else {
      fetchDefaultLocationWeather()
    }
  }

  const fetchCurrentLocationWeather = async () => {
    if (!location.latitude || !location.longitude) {
      fetchDefaultLocationWeather();
      return;
    }
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const url = `https://api.shecodes.io/weather/v1/current?lat=${location.latitude}&lon=${location.longitude}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setWeather({data: response.data, loading: false, error: false})
    } catch(error) {
      fetchDefaultLocationWeather()
    }
  }

  const fetchDefaultLocationWeather = async () => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const url = `https://api.shecodes.io/weather/v1/current?query=Rabat&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      setWeather({ data: response.data, loading: false, error: false });
    } catch (error) {
      setWeather({ data: {}, loading: false, error: true });
      console.log("error", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      fetchLocation()
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    fetchCurrentLocationWeather()
  }, [location])

  return (
    <div className="App">

      {/* SearchEngine component */}
      <SearchEngine query={query} setQuery={setQuery} search={search} fetchLocation={fetchLocation} />

      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry city not found, please try again.
            </span>
          </span>
        </>
      )}

      {weather && weather.data && weather.data.condition && (
        // Forecast component
        <Forecast weather={weather} toDate={toDate} />
      )}
    </div>
  );
}

export default App;
