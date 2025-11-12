import React from "react";

const PaymentOption = ({ name, value, label, desc, selectedValue, onChange }) => (
    <label className={`block p-4 border rounded-lg cursor-pointer transition ${selectedValue === value ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}>
        <div className="flex items-center">
            <input
                type="radio"
                name={name}
                value={value}
                checked={selectedValue === value}
                onChange={onChange}
                className="text-orange-500 focus:ring-orange-500 mr-3"
            />
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    </label>
);

export default PaymentOption;
