import React, { useState, useEffect } from "react";
import Search from "./inputSearch";
import StopsDisplay from "./Fetchdata";
import icon from "./kmb_icon.png";
// Define the KMB API URL
const url = "https://data.etabus.gov.hk/v1/transport/kmb/route/";

function App() {
    const [busRoutes, setBusRoutes] = useState([]); // Store all bus routes
    const [filteredRoutes, setFilteredRoutes] = useState([]); // Store filtered routes
    const [error, setError] = useState("");
    const [selectedRoute, setSelectedRoute] = useState(null); // For selected route (optional)

    // Fetch bus route data from KMB API
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setBusRoutes(data.data); // Set all bus routes
                // console.log(data);
            } catch (err) {
                setError("Failed to fetch bus routes");
            }
        };
        fetchRoutes();
    }, []);

    // Handle Search Query
    const handleSearch = (query) => {
        if (query === "") {
            setFilteredRoutes([]); // Reset when no input
            return;
        }
        const result = busRoutes.filter(
            (route) => route.route.toUpperCase() === query.toUpperCase()
        );
        setFilteredRoutes(result); // Set the filtered bus routes
    };

    // Handle selecting a route
    const handleRouteSelect = (route) => {
        setSelectedRoute(route); // Set selected route when user clicks a button
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <img
                    src={icon}
                    alt="App Icon"
                    className="w-32 h-auto mx-auto mb-4"
                />
                <Search setBusRoutes={handleSearch} />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                {filteredRoutes.length > 0 ? (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-2">
                            搜尋結果:
                        </h3>
                        {filteredRoutes.map((route, index) => (
                            <div key={index}>
                                <button
                                    onClick={() => handleRouteSelect(route)}
                                    className="w-full text-left px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition mt-2"
                                >
                                    {route.route} - {route.orig_tc} 至{" "}
                                    {route.dest_tc}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No routes found</p>
                )}

                {selectedRoute && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-2">
                            已選擇路線:
                        </h3>
                        <p className="text-gray-800">{selectedRoute.route}</p>
                        <p className="text-gray-600">
                            {selectedRoute.orig_tc} 至 {selectedRoute.dest_tc}
                        </p>
                        <StopsDisplay
                            route={selectedRoute.route}
                            bound={selectedRoute.bound}
                            serviceType={selectedRoute.service_type}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
