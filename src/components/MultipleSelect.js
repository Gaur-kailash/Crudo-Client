import React, { useEffect, useState } from 'react';

function MultipleSelect({field,formData,setFormData}) {
  const options = field.options
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setselectedOptions] = useState([]);
  const [filteredOptions, setfilteredOptions] = useState([]);
  
  useEffect(()=>{
    setselectedOptions(formData[field.fieldName]);
    setSearchQuery("");
  },[formData])

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = options.filter(option =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    setfilteredOptions(filtered);
  };

  const handleoptionSelect = (option) => {
    setselectedOptions([...selectedOptions, option]);
    setFormData({...formData,[field.fieldName]:[...selectedOptions,option]})
    // setSearchQuery('');
    // setfilteredOptions([]);
  };

  const handleoptionRemove = (optionToRemove) => {
    const updatedoptions = selectedOptions.filter(option => option !== optionToRemove);
    setselectedOptions(updatedoptions);
    setFormData({...formData,[field.fieldName]:updatedoptions})
  };
  return (
    <div className="form-group">
      <input
        type="text"
        className="form-control"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search for a option..."
      />
      <div className="mt-2">
        {searchQuery !== "" && filteredOptions.map(option => (
          <button
            key={option}
            type="button"
            className="btn btn-outline-primary mr-2 mb-2"
            onClick={() => handleoptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {selectedOptions && selectedOptions.length !==0 && selectedOptions.map(option => (
          <div key={option} className="badge badge-pill badge-primary mr-2 mb-2">
            <button
              type="button"
              className="btn btn-sm btn-light ml-2 border"
              onClick={() => handleoptionRemove(option)}
              >
                {option}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleSelect;
