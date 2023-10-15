    //formstyles 
    import { StylesConfig } from 'react-select';

    export const customStyles: StylesConfig = {
        menu: (provided) => {
             return({
          ...provided,
          width: 200,
          color: "#121234",
          padding: 0,
          backgroundColor: "#18181b",
          textColor: "white"
        })},
        
        option: (provided, { isFocused }) => {
            return({
                ...provided,
                color: "#d4d4d8",
                backgroundColor: isFocused ? "#27272a" :"#18181b"
            });
        },

        singleValue: (styles) => {
            return(
                {...styles,
                    color: "#d4d4d8"
                });
        },
        control: (styles) => ({
            ...styles,
             width: 200,
             backgroundColor: "#fef2c9",
             padding: 0
           })
      }