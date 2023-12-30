import React from 'react';
import Select from 'react-select';
import { State } from 'country-state-city';

const StatesDropdown = ({ selectedState, selectedCountry, onChange }) => {
  
  const stateOptions = State.getStatesOfCountry(selectedCountry).map(state => ({
    value: state.isoCode,
    label: state.name,
  }));

  const selectedStateOption = stateOptions.find((option) => option.value === selectedState);

  return (
    <Select
      options={stateOptions}
      value={selectedStateOption||null}
      onChange={option => onChange(option.value)}
    />
  );
};

export default StatesDropdown;
