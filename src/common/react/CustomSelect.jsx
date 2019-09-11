import React from 'react';
import Select from 'react-dropdown-select';

const options = [
  {
    id: 'd44fdcc8-5c16-49aa-88d1-2356b712c4c9',
    name: 'Tania Yundt',
    username: 'Angeline.Schaden91',
    email: 'Ahmad_Leannon@hotmail.com',
    address: {
      street: 'Jennyfer Meadow',
      suite: 71254,
      city: 'East Demetris',
      zipcode: '55256-7186',
      geo: {
        lat: '-60.9645',
        lng: '79.4558'
      }
    },
    phone: '1-348-107-0262 x75087',
    website: 'brandi.net',
    company: {
      name: 'Mitchell, Stamm and Kerluke',
      catchPhrase: 'Visionary demand-driven strategy',
      bs: 'viral productize e-business'
    }
  }
];

function CustomSelect(props) {
  return (
    <Select
      placeholder="Select peoples"
      values={[options[0]]}
      create
      clearable
      separator
      options={options}
      labelField="name"
      valueField="email"
      dropdownPosition="bottom"
      onChange={values => console.log(values)}
      noDataLabel="No matches found"
      loading={false}
    />
  );
}

export default CustomSelect;
