import React, { useState } from "react";

export default function Search({ setBusRoutes }) {
    const [search, setSearch] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;

        // Regex pattern to allow only letters and numbers (no symbols)
        const isValid = /^[a-zA-Z0-9]*$/.test(value);

        if (isValid) {
            setSearch(value); // Update state only if input is valid
        } else {
            alert("Please enter only letters and numbers.");
        }
    };

    return (
        <div className="create-form mb-4">
            <input
                type="text"
                placeholder="請輸入路線"
                value={search}
                onChange={handleInputChange} // Use the custom function here
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg mb-3 focus:outline-none focus:border-blue-400 transition"
            />
            <button
                type="submit"
                onClick={() => {
                    setBusRoutes(search);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
            >
                搜尋路線
            </button>
        </div>
    );
}
