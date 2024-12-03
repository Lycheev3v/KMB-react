import React, { useEffect, useState } from "react";

const StopsDisplay = ({ route, bound, serviceType }) => {
    const [stopsData, setStopsData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStops = async () => {
            const boundDirection = bound === "I" ? "inbound" : "outbound";

            try {
                // Fetch stop IDs for the given route
                const response = await fetch(
                    `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${boundDirection}/${serviceType}`
                );
                const data = await response.json();
                const stopIDs = data.data.map((stop) => stop.stop);
                // Get stop IDs
                const destName = data.data[0].dest_tc; // Destination name

                // To store all stop data

                const stopsResult = await Promise.all(
                    stopIDs.map(async (stopID) => {
                        // Fetch stop name
                        const stopNameResponse = await fetch(
                            `https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`
                        );
                        const stopNameData = await stopNameResponse.json();

                        // Fetch ETA for each stop
                        const ETARes = await fetch(
                            `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopID}/${route}/${serviceType}`
                        );
                        const ETAData = await ETARes.json();

                        const etaTimes = ETAData.data
                            .slice(0, 3)
                            .map((etas) => {
                                const [date, timeWithOffset] =
                                    etas?.eta?.split("T");
                                const [hours, minutes] =
                                    timeWithOffset.split(":");
                                return `${hours}:${minutes}`; //
                            });

                        // Data push to result arr
                        return {
                            stopID: stopID,
                            name_tc: stopNameData.data.name_tc,
                            eta: etaTimes,
                        };
                    })
                );
                console.log(stopsResult);
                // Set stops data with destination name
                setStopsData({ destination: destName, stops: stopsResult });
                setError(""); // Clear any previous errors
            } catch (err) {
                console.log(err);
                setError("Failed to fetch bus stop data");
            }
        };

        if (route && bound && serviceType) {
            fetchStops();
        }
    }, [route, bound, serviceType]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!stopsData || stopsData.length === 0) {
        return <p>No stops found</p>;
    }

    return (
        <div>
            <h4>巴士路線{route}</h4>
            <ul>
                {stopsData.stops.map((stop, index) => (
                    <ol key={index}>
                        <strong>{index + 1}.</strong> {stop.name_tc} <br />
                        <strong>到站時間:</strong>
                        <ul>
                            {stop.eta.length > 0
                                ? stop.eta.map((time, idx) => (
                                      <li key={idx}>{time}</li>
                                  ))
                                : "No ETA available"}
                        </ul>
                    </ol>
                ))}
            </ul>
        </div>
    );
};
export default StopsDisplay;
