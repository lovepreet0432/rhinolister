import React, { useState } from 'react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    const isValid = validatePhoneNumber(value);
    console.log(isValid);
    setIsValidPhoneNumber(isValid);
  };



  const validatePhoneNumber = (value) => {
    try {
      const phoneNumberObj = parsePhoneNumber(value);
      return phoneNumberObj ? phoneNumberObj.isValid() : false;
    } catch (error) {
      return false;
    }
  };



  return (
    <div>
      <label>Phone Number:</label>
      <PhoneInput
        international
        defaultCountry="US"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      {!isValidPhoneNumber && <div style={{ color: 'red' }}>Invalid phone number</div>}
    </div>
  );
};

export default PhoneNumber;
