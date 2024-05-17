import React, { useState } from 'react'

let ModelDegradation = false;
let MaxPathDegradation = false;
let InformationPenalty = false;

export const Disadvantages = ({ onModelDegradation, onMaxPathDegradation, onInformationPenalty }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleSelectChange = (event) => {
        const buttonNumber = event.target.value;

        if (buttonNumber === '1' && !ModelDegradation) {
            ModelDegradation = true;
            onModelDegradation();
        } 
        else if (buttonNumber === '2' && !MaxPathDegradation) {
            MaxPathDegradation = true;
            onMaxPathDegradation();
        }
        else if (buttonNumber === '3' && !InformationPenalty) {
            InformationPenalty = true;
            onInformationPenalty();
        } 
        else if (buttonNumber === 'cancel') {
            if (ModelDegradation) {
                onModelDegradation();
                ModelDegradation = false;
            }
            if (MaxPathDegradation) {
                onMaxPathDegradation();
                MaxPathDegradation = false;
            }
            if (InformationPenalty) {
                onInformationPenalty();
                InformationPenalty = false;
            }
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
                <option value="2">Max path degradation (max 6) </option>
                <option value="3">Information penalty</option>
            </select>
        </div>
    );
};
