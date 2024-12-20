import React, { useState } from 'react';

function SelectWithImages({ options, onChange }) {
  const [selectedOption, setSelectedOption] = useState(null); // Inicializamos como null para no tener ninguna opción seleccionada al inicio

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange(value);
  };

  if (options.length === 0) {
    return <div>No options available</div>; // Manejar el caso en que no hay opciones disponibles
  }

  return (
    <div  className=" d-flex justify-content-center align-items-center m-0  p-0 " >
        <div className='row align-items-center justify-content-center'>
        {options.map((option) => (
          <div
            key={option.value}
            className="d-flex flex-column col align-items-center justify-content-center"
            style={{ backgroundColor: selectedOption === option.value ? 'grey' : 'transparent' }}
            onClick={() => handleChange(option.value)}
          >
            <img src={`http://localhost:5000/images/${option.image}`} alt={option.label} width="100" height="100" />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectWithImages;
