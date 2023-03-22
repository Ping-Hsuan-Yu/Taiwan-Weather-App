import React, { useRef } from "react";
import styled from "styled-components";
import { availableLocations } from "../utils/helpers";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: var(--boxShadow);
  background-color: var(--foregroundColor);
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: var(--titleColor);
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: var(--textColor);
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid var(--textColor);
  outline: none;
  width: 100%;
  max-width: 100%;
  color: var(--textColor);
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: var(--textColor);
    border-color: var(--textColor);
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

export default function WeatherSetting({ setSettingPage, currentCity, setCurrentCity }) {
  const cityName = useRef(currentCity);
  const handleSave = () => {
    localStorage.setItem("cityName", cityName.current.value);
    setCurrentCity(cityName.current.value);
    setSettingPage(false);
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>

      <StyledSelect id="location" name="location" ref={cityName} defaultValue={currentCity}>
        {availableLocations.map((location) => (
          <option value={location.cityName} key={location.cityName}>
            {location.cityName}
          </option>
        ))}
      </StyledSelect>

      <ButtonGroup>
        <Back
          onClick={() => {
            setSettingPage(false);
          }}
        >
          返回
        </Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
}
