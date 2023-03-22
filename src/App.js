import React, { useState, useMemo } from "react";
import styled from "styled-components";
import WeatherCard from "./views/WeatherCard";
import LocationSetting from "./views/LocationSetting";
import useWeatherAPI from "./hooks/useWeatherAPI";
import { findLocation } from "./utils/helpers";

const Container = styled.div`
  background-color: var(--backgroundColor);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-31DC3369-D513-4BC6-8BF8-518F5F245D78";

function App() {
  const [settingPage, setSettingPage] = useState(false);
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const {locationName, cityName} = currentLocation
  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName,
    cityName,
  });
  return (
    <Container>
      {!settingPage && (
        <WeatherCard
          weatherElement={weatherElement}
          fetchData={fetchData}
          setSettingPage={setSettingPage}
          currentCity={currentCity}
        />
      )}
      {settingPage && (
        <LocationSetting
          setSettingPage={setSettingPage}
          currentCity={currentCity}
          setCurrentCity={setCurrentCity}
        />
      )}
    </Container>
  );
}

export default App;
