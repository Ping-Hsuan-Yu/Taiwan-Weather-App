import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  )
    .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
    .then((data) => {
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];
      // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (["WDSD", "TEMP"].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      }, {});
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        isLoading: false,
      };
    });
};

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (["Wx", "PoP", "CI"].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      }, {});
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const fetchSunriseSunset = ({ authorizationKey, cityName }) => {
  const now = new Date();
  const today = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/\//g, "-");
  const tomorrow = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now.setDate(now.getDate() + 1))
    .replace(/\//g, "-");

  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${authorizationKey}&CountyName=${cityName}&parameter=SunRiseTime,SunSetTime&timeFrom=${today}&timeTo=${tomorrow}`
  )
    .then((response) => response.json())
    .then((data) => {
      const time = data.records.locations.location[0].time[0];
      const sunriseTimestamp = new Date(`${time.Date} ${time.SunRiseTime}`).getTime();
      const sunsetTimestamp = new Date(`${time.Date} ${time.SunSetTime}`).getTime();
      const nowTimeStamp = new Date().getTime();
      return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
        ? { moment: "day" }
        : { moment: "night" };
    });
};

export default function useWeatherAPI({ authorizationKey, locationName, cityName }) {
  // 定義會使用到的資料狀態
  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: "",
    comfortability: "",
    moment: "day",
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
    const [currentWeather, weatherForecast, sunriseSunset] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName }),
      fetchSunriseSunset({ authorizationKey, cityName }),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      ...sunriseSunset,
      isLoading: false,
    });
  }, [authorizationKey, locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
}
