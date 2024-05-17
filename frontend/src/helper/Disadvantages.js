import React, { useState } from 'react'

export const Disadvantages = ({ onModelDegradation, onMaxPathDegradation }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleSelectChange = (event) => {
        const buttonNumber = event.target.value;

        if (buttonNumber === '1') {
            onModelDegradation();
        } else if (buttonNumber === '2') {
            onMaxPathDegradation();
        } else if (buttonNumber === '3') {
            alert('Information penalty');
        } else if (buttonNumber === 'cancel') {
            onModelDegradation();
            setSelectedOption(""); 
            return;
        }

        setSelectedOption(buttonNumber);
    };

    return (
        <div className="custom-select">
            <select value={selectedOption} onChange={handleSelectChange} className="disadvantages-select">
                {selectedOption ? (
                    <option value="cancel">CANCEL DISADVANTAGE</option>
                ) : (
                    <option value="" disabled hidden>DISADVANTAGES</option>
                )}
                <option value="1">Model degradation</option>
                <option value="2">Max path degradation</option>
                <option value="3">Information penalty</option>
            </select>
        </div>
    );
};
