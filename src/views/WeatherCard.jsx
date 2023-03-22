import styled from "styled-components";

import { ReactComponent as AirFlowIcon } from "../images/airFlow.svg";
import { ReactComponent as RainIcon } from "../images/rain.svg";
import { ReactComponent as RefreshIcon } from "../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "../images/loading.svg";
import { ReactComponent as CogIcon } from "../images/cog.svg";
import WeatherIcon from "../components/WeatherIcon";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: var(--boxShadow);
  background-color: var(--foregroundColor);
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  font-weight: 300;
  color: var(--titleColor);
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: var(--textColor);
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: var(--temperatureColor);
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: 100;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: var(--textColor);
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: var(--textColor);
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  font-weight: 100;
  display: inline-flex;
  align-items: flex-end;
  color: var(--textColor);
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    /* isLoading 的時候才套用旋轉的效果 */
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

export default function WeatherCard({ weatherElement, fetchData, setSettingPage, currentCity}) {
  const {
    description,
    comfortability,
    temperature,
    weatherCode,
    windSpeed,
    rainPossibility,
    observationTime,
    moment,
    isLoading,
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      <Cog onClick={()=>{setSettingPage(true)}}/>
      <Location>{currentCity}</Location>
      <Description>
        {description} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {temperature} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon /> {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon /> {rainPossibility}%
      </Rain>
      <Refresh isLoading={isLoading}>
        最後觀測時間：{observationTime}
        {isLoading ? <LoadingIcon /> : <RefreshIcon onClick={fetchData} />}
      </Refresh>
    </WeatherCardWrapper>
  );
}
