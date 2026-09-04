// ==========================================
// RESQNET RESCUE CENTER - WEBSITE APP
// ==========================================

const BACKEND_URL =
    "https://resqnet-backend-7344.onrender.com";


// ==========================================
// SOS DATA
// ==========================================

let sosData = [];


// ==========================================
// LOCAL STATUS MEMORY
// ==========================================

const localSOSStatuses = {};


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let map = null;
let mapInitialized = false;
let mapMarkers = [];


// ==========================================
// DYNAMIC CSS
// ==========================================

function injectResponseStyles() {

    if (document.getElementById("resqnetDynamicStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "resqnetDynamicStyles";

    style.innerHTML = `

        /* ================================
           RESPONSE LIST
        ================================= */

        .response-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px;
        }


        /* ================================
           RESPONSE CARD
        ================================= */

        .response-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
            transition: all 0.2s ease;
        }

        .response-card:hover {
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.10);
            transform: translateY(-1px);
        }


        /* ================================
           RESPONSE HEADER
        ================================= */

        .response-card-header {
            min-height: 64px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 1px solid #edf0f4;
            background: #fafbfc;
        }

        .response-card-header > div {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }

        .response-card-header strong {
            font-size: 14px;
            font-weight: 700;
            color: #172033;
            word-break: break-all;
        }

        .response-card-header > span:last-child {
            font-size: 13px;
            color: #7b8798;
            white-space: nowrap;
        }


        /* ================================
           RESPONSE BODY
        ================================= */

        .response-card-body {
            padding: 20px;
        }

        .response-card-body h3 {
            margin: 0 0 7px;
            font-size: 19px;
            font-weight: 700;
            color: #172033;
        }

        .response-card-body p {
            margin: 0 0 18px;
            font-size: 14px;
            line-height: 1.6;
            color: #718096;
        }


        /* ================================
           RESPONSE DETAILS
        ================================= */

        .response-details {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
        }

        .response-details span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 11px;
            background: #f5f7fa;
            border: 1px solid #e8ebf0;
            border-radius: 8px;
            color: #4b5563;
            font-size: 13px;
        }


        /* ================================
           RESPONSE ACTIONS
        ================================= */

        .response-actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .response-actions button {
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .response-actions .respond-btn {
            background: #eef2f7;
            color: #172033;
        }

        .response-actions .respond-btn:hover {
            background: #dfe5ec;
        }

        .response-actions .resolve-btn {
            background: #16a34a;
            color: #ffffff;
        }

        .response-actions .resolve-btn:hover {
            background: #15803d;
        }


        /* ================================
           STATUS BADGES
        ================================= */

        .status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 9px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.4px;
        }

        .status-new {
            background: #fff1f1;
            color: #dc2626;
        }

        .status-active {
            background: #fff7e6;
            color: #d97706;
        }

        .status-resolved {
            background: #ecfdf3;
            color: #15803d;
        }


        /* ================================
           ALERT CARDS
        ================================= */

        .alert-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
            margin-bottom: 16px;
            box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
        }

        .alert-card-header {
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            background: #fafbfc;
            border-bottom: 1px solid #edf0f4;
        }

        .alert-card-header > div {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .alert-card-header strong {
            color: #172033;
            font-size: 14px;
            font-weight: 700;
            word-break: break-all;
        }

        .alert-card-header > span {
            color: #7b8798;
            font-size: 13px;
        }

        .alert-card-body {
            padding: 20px;
        }

        .alert-card-body h3 {
            margin: 0 0 7px;
            color: #172033;
            font-size: 19px;
        }

        .alert-card-body p {
            margin: 0 0 18px;
            color: #718096;
            line-height: 1.6;
            font-size: 14px;
        }

        .alert-details {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
        }

        .alert-details span {
            padding: 8px 11px;
            background: #f5f7fa;
            border: 1px solid #e8ebf0;
            border-radius: 8px;
            color: #4b5563;
            font-size: 13px;
        }


        /* ================================
           BUTTONS
        ================================= */

        .respond-btn,
        .resolve-btn,
        .map-popup-button {
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .respond-btn {
            background: #172033;
            color: #ffffff;
        }

        .respond-btn:hover {
            background: #2d3a52;
        }

        .resolve-btn {
            background: #16a34a;
            color: #ffffff;
        }

        .resolve-btn:hover {
            background: #15803d;
        }

        .map-popup-button {
            background: #172033;
            color: #ffffff;
        }


        /* ================================
           EMPTY PANEL
        ================================= */

        .response-list .empty-panel {
            padding: 55px 20px;
            text-align: center;
            border: 1px dashed #d8dee8;
            border-radius: 12px;
            background: #fafbfc;
        }

        .response-list .empty-panel .big-icon {
            font-size: 36px;
            margin-bottom: 12px;
            color: #9aa5b5;
        }

        .response-list .empty-panel h3 {
            margin: 0 0 8px;
            color: #273449;
        }

        .response-list .empty-panel p {
            margin: 0;
            color: #8994a5;
            font-size: 14px;
        }


        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 700px) {

            .response-card-header,
            .alert-card-header {
                align-items: flex-start;
                flex-direction: column;
                gap: 10px;
            }

            .response-details,
            .alert-details {
                flex-direction: column;
            }

            .response-actions {
                flex-direction: column;
                align-items: stretch;
            }

            .response-actions button {
                width: 100%;
            }

        }

    `;

    document.head.appendChild(style);
}


// ==========================================
// LOAD SOS DATA
// ==========================================

async function loadSOSData() {

    try {

        console.log("Loading SOS data...");

        const response =
            await fetch(
                `${BACKEND_URL}/api/sos`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.sos)
        ) {

            throw new Error(
                "Invalid SOS response"
            );

        }


        sosData =
            data.sos.map(
                (sos) => {

                    const backendStatus =
                        String(
                            sos.status || "NEW"
                        ).toUpperCase();


                    const localStatus =
                        localSOSStatuses[
                            sos.sos_id
                        ];


                    return {

                        id:
                            sos.sos_id,

                        type:
                            sos.emergency_type ||
                            "Other",

                        people:
                            Number(
                                sos.people_count
                            ) || 1,

                        latitude:
                            Number(
                                sos.latitude
                            ),

                        longitude:
                            Number(
                                sos.longitude
                            ),

                        description:
                            sos.description ||
                            "Emergency assistance requested.",

                        status:
                            localStatus ||
                            backendStatus,

                        time:
                            formatSOSTime(
                                sos.created_at
                            ),

                        distance:
                            "-",

                        databaseId:
                            sos.id,

                        deviceId:
                            sos.device_id,

                        deviceName:
                            sos.device_name,

                        acceptedAt:
                            sos.accepted_at,

                        resolvedAt:
                            sos.resolved_at

                    };

                }
            );


        console.log(
            "RESQNET SOS DATA:",
            sosData
        );


        refreshAllUI();


    } catch (error) {

        console.error(
            "Failed to load SOS data:",
            error
        );

    }

}


// ==========================================
// FORMAT SOS TIME
// ==========================================

function formatSOSTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleString();

}


// ==========================================
// FIND SOS
// ==========================================

function findSOS(sosId) {

    if (!sosId) {
        return null;
    }


    const directMatch =
        sosData.find(
            (item) =>
                item.id === sosId
        );


    if (directMatch) {
        return directMatch;
    }


    // Old static HTML compatibility

    if (sosId === "SOS-1048") {
        return sosData[0] || null;
    }

    if (sosId === "SOS-1047") {
        return sosData[1] || null;
    }

    if (sosId === "SOS-1046") {
        return sosData[2] || null;
    }


    return null;

}


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(
    pageId,
    clickedButton = null
) {

    document
        .querySelectorAll(".page")
        .forEach(
            (page) => {

                page.style.display =
                    "none";

            }
        );


    const selectedPage =
        document.getElementById(
            pageId
        );


    if (selectedPage) {

        selectedPage.style.display =
            "block";

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    } else {

        document
            .querySelectorAll(".nav-item")
            .forEach(
                (button) => {

                    const text =
                        button.innerText
                            .toLowerCase();


                    if (
                        (
                            pageId === "dashboard" &&
                            text.includes("dashboard")
                        ) ||
                        (
                            pageId === "alerts" &&
                            text.includes("sos alerts")
                        ) ||
                        (
                            pageId === "map" &&
                            text.includes("emergency map")
                        ) ||
                        (
                            pageId === "active" &&
                            text.includes("active responses")
                        ) ||
                        (
                            pageId === "resolved" &&
                            text.includes("resolved")
                        )
                    ) {

                        button.classList.add(
                            "active"
                        );

                    }

                }
            );

    }


    updatePageTitle(pageId);


    if (pageId === "map") {

        setTimeout(
            () => {

                if (!mapInitialized) {

                    initializeMap();

                } else {

                    map.invalidateSize();

                    updateMapMarkers();

                }

            },
            150
        );

    }


    refreshAllUI();

}


// ==========================================
// PAGE TITLE
// ==========================================

function updatePageTitle(pageId) {

    const title =
        document.getElementById(
            "pageTitle"
        );


    if (!title) {
        return;
    }


    const titles = {

        dashboard:
            "Dashboard",

        alerts:
            "SOS Alerts",

        map:
            "Emergency Map",

        active:
            "Active Responses",

        resolved:
            "Resolved"

    };


    title.innerText =
        titles[pageId] ||
        "Dashboard";

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const newSOS =
        sosData.filter(
            (sos) =>
                sos.status === "NEW"
        ).length;


    const activeSOS =
        sosData.filter(
            (sos) =>
                sos.status === "ACTIVE"
        ).length;


    const resolvedSOS =
        sosData.filter(
            (sos) =>
                sos.status === "RESOLVED"
        ).length;


    const nearbySOS =
        sosData.length;


    const statNew =
        document.getElementById(
            "statNewSOS"
        );


    const statActive =
        document.getElementById(
            "statActive"
        );


    const statResolved =
        document.getElementById(
            "statResolved"
        );


    const statNearby =
        document.getElementById(
            "statNearby"
        );


    if (statNew) {
        statNew.innerText =
            newSOS;
    }

    if (statActive) {
        statActive.innerText =
            activeSOS;
    }

    if (statResolved) {
        statResolved.innerText =
            resolvedSOS;
    }

    if (statNearby) {
        statNearby.innerText =
            nearbySOS;
    }


    updateDashboardTable();

}


// ==========================================
// DASHBOARD TABLE
// ==========================================

function updateDashboardTable() {

    const tableBody =
        document.getElementById(
            "recentSOSBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (sosData.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No SOS alerts received
                </td>

            </tr>

        `;

        return;

    }


    sosData.forEach(
        (sos) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.style.cursor =
                "pointer";


            row.onclick =
                function() {

                    openSOS(
                        sos.id
                    );

                };


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(
                            sos.id
                        )}
                    </strong>

                    <small>
                        ${Number(
                            sos.latitude
                        ).toFixed(4)},
                        ${Number(
                            sos.longitude
                        ).toFixed(4)}
                    </small>

                </td>


                <td>

                    <span class="emergency-type">
                        ${escapeHtml(
                            sos.type
                        )}
                    </span>

                </td>


                <td>
                    ${sos.people}
                </td>


                <td>
                    ${Number(
                        sos.latitude
                    ).toFixed(4)},
                    ${Number(
                        sos.longitude
                    ).toFixed(4)}
                </td>


                <td>
                    ${escapeHtml(
                        sos.distance || "-"
                    )}
                </td>


                <td>

                    <span
                        class="status ${getStatusClass(
                            sos.status
                        )}"
                    >
                        ${escapeHtml(
                            sos.status
                        )}
                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="respond-btn"
                        onclick="event.stopPropagation(); openSOS('${escapeJs(
                            sos.id
                        )}')"
                    >
                        VIEW
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    switch (status) {

        case "NEW":
            return "status-new";

        case "ACTIVE":
            return "status-active";

        case "RESOLVED":
            return "status-resolved";

        default:
            return "";

    }

}


// ==========================================
// SOS ALERTS PAGE
// ==========================================

function updateAlertsPage() {

    const alertContainer =
        document.getElementById(
            "alertList"
        );


    if (!alertContainer) {
        return;
    }


    alertContainer.innerHTML = "";


    const newAlerts =
        sosData.filter(
            (sos) =>
                sos.status === "NEW"
        );


    if (newAlerts.length === 0) {

        alertContainer.innerHTML = `

            <div class="empty-panel">

                <h3>
                    No New SOS Alerts
                </h3>

                <p>
                    There are currently no new
                    emergency alerts.
                </p>

            </div>

        `;

        return;

    }


    newAlerts.forEach(
        (sos) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "alert-card";


            card.innerHTML = `

                <div class="alert-card-header">

                    <div>

                        <strong>
                            ${escapeHtml(
                                sos.id
                            )}
                        </strong>

                        <span class="status status-new">
                            NEW
                        </span>

                    </div>


                    <span>
                        ${escapeHtml(
                            sos.time || ""
                        )}
                    </span>

                </div>


                <div class="alert-card-body">

                    <h3>
                        ${escapeHtml(
                            sos.type
                        )}
                    </h3>


                    <p>
                        ${escapeHtml(
                            sos.description
                        )}
                    </p>


                    <div class="alert-details">

                        <span>
                            👥
                            ${sos.people}
                            ${sos.people === 1 ? "person" : "people"}
                        </span>

                        <span>
                            📍
                            ${Number(
                                sos.latitude
                            ).toFixed(4)},
                            ${Number(
                                sos.longitude
                            ).toFixed(4)}
                        </span>

                        <span>
                            📏
                            ${escapeHtml(
                                sos.distance || "-"
                            )}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="respond-btn"
                        onclick="openSOS('${escapeJs(
                            sos.id
                        )}')"
                    >
                        VIEW & RESPOND
                    </button>

                </div>

            `;


            alertContainer.appendChild(
                card
            );

        }
    );

}


// ==========================================
// NOTIFICATION BADGE
// ==========================================

function updateNotificationBadge() {

    const newCount =
        sosData.filter(
            (sos) =>
                sos.status === "NEW"
        ).length;


    const badge =
        document.getElementById(
            "sosBadge"
        );


    const notification =
        document.getElementById(
            "notificationCount"
        );


    if (badge) {
        badge.innerText =
            newCount;
    }


    if (notification) {
        notification.innerText =
            newCount;
    }

}


// ==========================================
// PRIORITY ALERT
// ==========================================

function updatePriorityAlert() {

    const priorityContent =
        document.getElementById(
            "priorityContent"
        );


    if (!priorityContent) {
        return;
    }


    const prioritySOS =
        sosData.find(
            (sos) =>
                sos.status === "NEW"
        );


    if (!prioritySOS) {

        priorityContent.innerHTML = `

            <div class="priority-number">
                No Active Priority Alert
            </div>

            <h4>
                Waiting for SOS
            </h4>

            <p>
                New emergency alerts will appear here.
            </p>

            <div class="location">

                <span>
                    ⌖
                </span>

                <div>

                    <strong>
                        No alert
                    </strong>

                    <small>
                        Waiting for emergency
                    </small>

                </div>

            </div>

        `;

        return;

    }


    priorityContent.innerHTML = `

        <div class="priority-number">
            ${escapeHtml(
                prioritySOS.id
            )}
        </div>


        <h4>
            ${escapeHtml(
                prioritySOS.type
            )}
        </h4>


        <p>
            ${escapeHtml(
                prioritySOS.description
            )}
        </p>


        <div class="location">

            <span>
                ⌖
            </span>

            <div>

                <strong>
                    ${escapeHtml(
                        prioritySOS.distance ||
                        "-"
                    )}
                </strong>

                <small>
                    ${Number(
                        prioritySOS.latitude
                    ).toFixed(6)},
                    ${Number(
                        prioritySOS.longitude
                    ).toFixed(6)}
                </small>

            </div>

        </div>


        <button
            type="button"
            class="respond-button"
            onclick="openSOS('${escapeJs(
                prioritySOS.id
            )}')"
        >
            RESPOND TO SOS
        </button>

    `;

}


// ==========================================
// OPEN PRIORITY SOS
// ==========================================

function openPrioritySOS() {

    const sos =
        sosData.find(
            (item) =>
                item.status === "NEW"
        );


    if (sos) {

        openSOS(
            sos.id
        );

    }

}


// ==========================================
// OPEN SOS MODAL
// ==========================================

function openSOS(sosId) {

    console.log(
        "Opening SOS:",
        sosId
    );


    const sos =
        findSOS(
            sosId
        );


    if (!sos) {

        console.warn(
            "SOS not found:",
            sosId,
            sosData
        );


        alert(
            "SOS data is still loading. Please wait a moment and try again."
        );

        return;

    }


    const modal =
        document.getElementById(
            "sosModal"
        );


    if (!modal) {

        alert(
            "SOS modal was not found."
        );

        return;

    }


    const modalSOSId =
        document.getElementById(
            "modalSOSId"
        );


    const modalType =
        document.getElementById(
            "modalType"
        );


    const modalPeople =
        document.getElementById(
            "modalPeople"
        );


    const modalLocation =
        document.getElementById(
            "modalLocation"
        );


    const modalDistance =
        document.getElementById(
            "modalDistance"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const acceptButton =
        document.getElementById(
            "acceptSOSButton"
        );


    if (modalSOSId) {

        modalSOSId.innerText =
            sos.id;

    }


    if (modalType) {

        modalType.innerText =
            sos.type;

    }


    if (modalPeople) {

        modalPeople.innerText =
            sos.people;

    }


    if (modalLocation) {

        modalLocation.innerText =
            `${Number(
                sos.latitude
            ).toFixed(6)}, ` +
            `${Number(
                sos.longitude
            ).toFixed(6)}`;

    }


    if (modalDistance) {

        modalDistance.innerText =
            sos.distance ||
            "-";

    }


    if (modalDescription) {

        modalDescription.innerText =
            sos.description;

    }


    if (acceptButton) {

        if (sos.status === "NEW") {

            acceptButton.style.display =
                "inline-block";

            acceptButton.innerText =
                "ACCEPT & DISPATCH";

            acceptButton.disabled =
                false;

        } else {

            acceptButton.style.display =
                "none";

        }

    }


    modal.style.display =
        "flex";


    if (
        mapInitialized &&
        map
    ) {

        map.setView(
            [
                Number(
                    sos.latitude
                ),
                Number(
                    sos.longitude
                )
            ],
            15
        );

    }

}


// ==========================================
// CLOSE SOS
// ==========================================

function closeSOS() {

    const modal =
        document.getElementById(
            "sosModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// ACCEPT / DISPATCH SOS
// ==========================================

async function acceptSOS() {

    const sosIdElement =
        document.getElementById(
            "modalSOSId"
        );


    if (!sosIdElement) {

        console.warn(
            "modalSOSId not found"
        );

        return;

    }


    const sosId =
        sosIdElement.innerText.trim();


    const sos =
        findSOS(
            sosId
        );


    if (!sos) {

        console.warn(
            "SOS not found:",
            sosId
        );

        return;

    }


    if (sos.status !== "NEW") {

        alert(
            `${sos.id} is already ${sos.status}.`
        );

        closeSOS();

        return;

    }


    const acceptButton =
        document.getElementById(
            "acceptSOSButton"
        );


    try {

        // Prevent double clicking

        if (acceptButton) {

            acceptButton.disabled =
                true;

            acceptButton.innerText =
                "DISPATCHING...";

        }


        console.log(
            "Sending ACTIVE status to backend:",
            sos.id
        );


        const response =
            await fetch(
                `${BACKEND_URL}/api/sos/${encodeURIComponent(
                    sos.id
                )}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: "ACTIVE"
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                `Backend returned ${response.status}`
            );

        }


        // ==================================
        // SUCCESS - UPDATE LOCAL DATA
        // ==================================

        localSOSStatuses[
            sos.id
        ] = "ACTIVE";


        sos.status =
            "ACTIVE";


        sos.acceptedAt =
            data.sos?.accepted_at ||
            new Date().toISOString();


        console.log(
            "SOS accepted successfully:",
            data
        );


        closeSOS();


        refreshAllUI();


        alert(
            `${sos.id} has been accepted and moved to Active Responses.`
        );


        // Confirm database state

        await loadSOSData();


    } catch (error) {

        console.error(
            "Failed to accept SOS:",
            error
        );


        if (acceptButton) {

            acceptButton.disabled =
                false;

            acceptButton.innerText =
                "ACCEPT & DISPATCH";

        }


        alert(
            `Unable to accept ${sos.id}.\n\n${error.message}`
        );

    }

}


// ==========================================
// ACTIVE RESPONSES
// ==========================================

function updateActiveResponses() {

    const container =
        document.getElementById(
            "activeResponseList"
        );


    if (!container) {
        return;
    }


    const activeResponses =
        sosData.filter(
            (sos) =>
                sos.status === "ACTIVE"
        );


    container.innerHTML = "";


    if (activeResponses.length === 0) {

        container.innerHTML = `

            <div class="empty-panel">

                <div class="big-icon">
                    ↗
                </div>

                <h3>
                    No Active Responses
                </h3>

                <p>
                    Accepted emergency responses
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    activeResponses.forEach(
        (sos) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "response-card";


            card.innerHTML = `

                <div class="response-card-header">

                    <div>

                        <strong>
                            ${escapeHtml(
                                sos.id
                            )}
                        </strong>

                        <span class="status status-active">
                            ACTIVE
                        </span>

                    </div>


                    <span>
                        ${escapeHtml(
                            sos.acceptedAt
                                ? "Accepted"
                                : "In progress"
                        )}
                    </span>

                </div>


                <div class="response-card-body">

                    <h3>
                        ${escapeHtml(
                            sos.type
                        )}
                    </h3>


                    <p>
                        ${escapeHtml(
                            sos.description
                        )}
                    </p>


                    <div class="response-details">

                        <span>
                            👥
                            ${sos.people}
                            ${sos.people === 1 ? "person" : "people"}
                        </span>


                        <span>
                            📍
                            ${Number(
                                sos.latitude
                            ).toFixed(4)},
                            ${Number(
                                sos.longitude
                            ).toFixed(4)}
                        </span>


                        ${
                            sos.deviceName
                                ? `
                                    <span>
                                        📱
                                        ${escapeHtml(
                                            sos.deviceName
                                        )}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <div class="response-actions">

                        <button
                            type="button"
                            class="respond-btn"
                            onclick="viewActiveSOS('${escapeJs(
                                sos.id
                            )}')"
                        >
                            VIEW
                        </button>


                        <button
                            type="button"
                            class="resolve-btn"
                            onclick="resolveSOS('${escapeJs(
                                sos.id
                            )}')"
                        >
                            MARK RESOLVED
                        </button>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// VIEW ACTIVE SOS
// ==========================================

function viewActiveSOS(sosId) {

    const sos =
        findSOS(
            sosId
        );


    if (!sos) {
        return;
    }


    showPage(
        "map"
    );


    setTimeout(
        () => {

            if (
                mapInitialized &&
                map
            ) {

                map.setView(
                    [
                        Number(
                            sos.latitude
                        ),
                        Number(
                            sos.longitude
                        )
                    ],
                    16
                );

            }


            openSOS(
                sos.id
            );

        },
        250
    );

}


// ==========================================
// RESOLVE SOS
// ==========================================

async function resolveSOS(sosId) {

    const sos =
        findSOS(
            sosId
        );


    if (!sos) {

        console.warn(
            "SOS not found:",
            sosId
        );

        return;

    }


    if (sos.status !== "ACTIVE") {

        alert(
            `${sos.id} is not currently active.`
        );

        return;

    }


    const confirmed =
        confirm(
            `Mark ${sos.id} as resolved?`
        );


    if (!confirmed) {
        return;
    }


    try {

        console.log(
            "Sending RESOLVED status to backend:",
            sos.id
        );


        const response =
            await fetch(
                `${BACKEND_URL}/api/sos/${encodeURIComponent(
                    sos.id
                )}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: "RESOLVED"
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                `Backend returned ${response.status}`
            );

        }


        // ==================================
        // SUCCESS - UPDATE LOCAL DATA
        // ==================================

        localSOSStatuses[
            sos.id
        ] = "RESOLVED";


        sos.status =
            "RESOLVED";


        sos.resolvedAt =
            data.sos?.resolved_at ||
            new Date().toISOString();


        console.log(
            "SOS resolved successfully:",
            data
        );


        refreshAllUI();


        alert(
            `${sos.id} has been marked as resolved.`
        );


        // Confirm database state

        await loadSOSData();


    } catch (error) {

        console.error(
            "Failed to resolve SOS:",
            error
        );


        alert(
            `Unable to resolve ${sos.id}.\n\n${error.message}`
        );

    }

}


// ==========================================
// RESOLVED PAGE
// ==========================================

function updateResolvedPage() {

    const container =
        document.getElementById(
            "resolvedList"
        );


    if (!container) {
        return;
    }


    const resolvedResponses =
        sosData.filter(
            (sos) =>
                sos.status === "RESOLVED"
        );


    container.innerHTML = "";


    if (resolvedResponses.length === 0) {

        container.innerHTML = `

            <div class="empty-panel">

                <div class="big-icon">
                    ✓
                </div>

                <h3>
                    No Resolved Responses
                </h3>

                <p>
                    Resolved emergency cases
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    resolvedResponses.forEach(
        (sos) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "response-card";


            card.innerHTML = `

                <div class="response-card-header">

                    <div>

                        <strong>
                            ${escapeHtml(
                                sos.id
                            )}
                        </strong>

                        <span class="status status-resolved">
                            RESOLVED
                        </span>

                    </div>


                    <span>
                        ${escapeHtml(
                            sos.resolvedAt
                                ? "Completed"
                                : "Resolved"
                        )}
                    </span>

                </div>


                <div class="response-card-body">

                    <h3>
                        ${escapeHtml(
                            sos.type
                        )}
                    </h3>


                    <p>
                        ${escapeHtml(
                            sos.description
                        )}
                    </p>


                    <div class="response-details">

                        <span>
                            👥
                            ${sos.people}
                            ${sos.people === 1 ? "person" : "people"}
                        </span>


                        <span>
                            📍
                            ${Number(
                                sos.latitude
                            ).toFixed(4)},
                            ${Number(
                                sos.longitude
                            ).toFixed(4)}
                        </span>


                        ${
                            sos.deviceName
                                ? `
                                    <span>
                                        📱
                                        ${escapeHtml(
                                            sos.deviceName
                                        )}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// REFRESH ALL UI
// ==========================================

function refreshAllUI() {

    updateDashboard();

    updateAlertsPage();

    updateActiveResponses();

    updateResolvedPage();

    updateMapMarkers();

    updateNotificationBadge();

    updatePriorityAlert();

}


// ==========================================
// LEAFLET MAP
// ==========================================

function initializeMap() {

    const mapElement =
        document.getElementById(
            "resqnetMap"
        );


    if (!mapElement) {
        return;
    }


    if (
        typeof L ===
        "undefined"
    ) {

        console.error(
            "Leaflet is not loaded."
        );

        return;

    }


    if (mapInitialized) {
        return;
    }


    map =
        L.map(
            "resqnetMap"
        ).setView(
            [
                16.3618,
                80.2359
            ],
            13
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(
        map
    );


    L.marker(
        [
            16.3618,
            80.2359
        ]
    )
        .addTo(
            map
        )
        .bindPopup(`

            <strong>
                RESQNET Rescue Center
            </strong>

            <br>

            Central Rescue Center

            <br>

            <span style="color:green;">
                ● ONLINE
            </span>

        `);


    mapInitialized =
        true;


    updateMapMarkers();

}


// ==========================================
// MAP MARKERS
// ==========================================

function updateMapMarkers() {

    if (
        !mapInitialized ||
        !map
    ) {

        return;

    }


    mapMarkers.forEach(
        (marker) => {

            map.removeLayer(
                marker
            );

        }
    );


    mapMarkers = [];


    sosData.forEach(
        (sos) => {

            const latitude =
                Number(
                    sos.latitude
                );


            const longitude =
                Number(
                    sos.longitude
                );


            if (
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
            ) {

                return;

            }


            const marker =
                L.marker(
                    [
                        latitude,
                        longitude
                    ]
                );


            marker.addTo(
                map
            );


            marker.bindPopup(`

                <strong>
                    ${escapeHtml(
                        sos.id
                    )}
                </strong>

                <br>

                Type:
                ${escapeHtml(
                    sos.type
                )}

                <br>

                People:
                ${sos.people}

                <br>

                Status:
                <b>
                    ${escapeHtml(
                        sos.status
                    )}
                </b>

                <br>

                Location:
                ${latitude.toFixed(6)},
                ${longitude.toFixed(6)}

                <br><br>

                <button
                    type="button"
                    class="map-popup-button"
                    onclick="openSOS('${escapeJs(
                        sos.id
                    )}')"
                >
                    VIEW SOS
                </button>

            `);


            mapMarkers.push(
                marker
            );

        }
    );

}


// ==========================================
// MODAL OUTSIDE CLICK
// ==========================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "sosModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeSOS();

        }

    }
);


// ==========================================
// ESC KEY
// ==========================================

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeSOS();

        }

    }
);


// ==========================================
// CLOCK
// ==========================================

function updateClock() {

    const clock =
        document.getElementById(
            "currentTime"
        );


    if (!clock) {
        return;
    }


    clock.innerText =
        new Date().toLocaleTimeString();

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// JAVASCRIPT STRING SAFETY
// ==========================================

function escapeJs(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "RESQNET website started."
        );


        injectResponseStyles();


        showPage(
            "dashboard"
        );


        updateClock();


        setInterval(
            updateClock,
            1000
        );


        await loadSOSData();


        setInterval(
            loadSOSData,
            5000
        );

    }
);