// /client/src/components/CustomDropdown.js
import React, { useState } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown-container">
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {selected ? selected.label : placeholder}
                <i className={`fas fa-chevron-down dropdown-icon ${isOpen ? 'open' : ''}`}></i>
            </div>
            {isOpen && (
                <ul className="dropdown-list">
                    {options.map((option) => (
                        <li 
                            key={option.value} 
                            onClick={() => handleSelect(option)}
                            className={selected && selected.value === option.value ? 'selected' : ''}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;