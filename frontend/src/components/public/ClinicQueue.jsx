import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    FaUsers,
    FaClock,
    FaTicketAlt,
    FaSyncAlt,
    FaCircle,
} from "react-icons/fa";

import "./publicComp.css";


const ClinicQueue = () => {

    const [queueData, setQueueData] = useState({
        waitingCount: 0,
        queue: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // --------------------------------------------------
    // Fetch current clinic queue
    // --------------------------------------------------

    const fetchQueue = async () => {

        try {

            setError("");

            const response = await api.get("/api/public/queue")

            if (response.data.success) {

                setQueueData({
                    waitingCount:
                        response.data.data.waitingCount || 0,

                    queue:
                        response.data.data.queue || [],
                });
            }

        } catch (error) {

            console.error(
                "Failed to fetch clinic queue:",
                error
            );

            setError(
                "Unable to load the current queue."
            );

        } finally {

            setLoading(false);
        }
    };


    // --------------------------------------------------
    // Initial load + automatic refresh
    // --------------------------------------------------

    useEffect(() => {

        fetchQueue();

        const interval = setInterval(() => {
            fetchQueue();
        }, 10000);

        return () => clearInterval(interval);

    }, []);


    // --------------------------------------------------
    // Manual refresh
    // --------------------------------------------------

    const handleRefresh = () => {

        setLoading(true);

        fetchQueue();
    };


    // --------------------------------------------------
    // Loading state
    // --------------------------------------------------

    if (loading && queueData.queue.length === 0) {

        return (
            <section className="clinic-queue">

                <div className="queue-loading">

                    <div className="queue-spinner"></div>

                    <p>
                        Loading clinic queue...
                    </p>

                </div>

            </section>
        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <section className="clinic-queue">

            {/* Header */}

            <div className="queue-header">

                <div className="queue-heading">

                    <span className="queue-icon">
                        <FaTicketAlt />
                    </span>

                    <div>

                        <h2>
                            Clinic Queue
                        </h2>

                        <p>
                            Current waiting patients
                        </p>

                    </div>

                </div>


                <button
                    className="queue-refresh-btn"
                    onClick={handleRefresh}
                    disabled={loading}
                    title="Refresh queue"
                >

                    <FaSyncAlt
                        className={
                            loading
                                ? "refresh-spinning"
                                : ""
                        }
                    />

                    <span>
                        Refresh
                    </span>

                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="queue-error">

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={handleRefresh}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* Waiting summary */}

            <div className="queue-summary">

                <div className="summary-icon">
                    <FaUsers />
                </div>

                <div className="summary-content">

                    <span>
                        Patients Waiting
                    </span>

                    <strong>
                        {queueData.waitingCount}
                    </strong>

                </div>

            </div>


            {/* Queue */}

            <div className="queue-list-section">

                <div className="queue-list-header">

                    <h3>
                        Waiting Queue
                    </h3>

                    <span>
                        {queueData.waitingCount}{" "}
                        {queueData.waitingCount === 1
                            ? "patient"
                            : "patients"}
                    </span>

                </div>


                {queueData.queue.length === 0 ? (

                    <div className="empty-queue">

                        <div className="empty-queue-icon">
                            <FaClock />
                        </div>

                        <h3>
                            No patients waiting
                        </h3>

                        <p>
                            The clinic queue is currently empty.
                        </p>

                    </div>

                ) : (

                    <div className="queue-list">

                        {queueData.queue.map(
                            (patient, index) => (

                                <div
                                    className="queue-item"
                                    key={patient.tokenNumber}
                                >

                                    <div className="queue-position">

                                        <span>
                                            {index + 1}
                                        </span>

                                    </div>


                                    <div className="queue-token">

                                        <span>
                                            Token
                                        </span>

                                        <strong>
                                            #{patient.tokenNumber}
                                        </strong>

                                    </div>


                                    <div className="queue-status">

                                        <FaCircle />

                                        <span>
                                            {patient.status}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* Footer information */}

            <div className="queue-footer">

                <FaClock />

                <span>
                    Queue updates automatically every 10 seconds
                </span>

            </div>

        </section>
    );
};


export default ClinicQueue;