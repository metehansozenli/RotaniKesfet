
var markers = new Array();
const clusterData = window.clusterData;

document.addEventListener('DOMContentLoaded', function() {
    insertHTMLIntoCluster();
    initMaps();
});


function organizeLocationsByDay(data) {
    const organizedData = {
        userID: data.userID,
        locations: {}
    };

    data.clusters.forEach(city => {
        const cityID = city.cityID;
        organizedData.locations[cityID] = [];

        city.clusters.forEach((cluster, index) => {
            const dayData = {
                day: index + 1,
                locations: cluster.map(location => ({
                    locationID: location.locationID,
                    coordinates: location.coordinates
                }))
            };
            organizedData.locations[cityID].push(dayData);
        });
    });

    return organizedData;
}

const organizedData = organizeLocationsByDay(clusterData);

function insertHTMLIntoCluster() {
    const clusters = document.querySelector('.clusters');
    const title = document.querySelector('.routeTitle');
    const totalDays = getTotalDays(organizedData);
    clusters.innerHTML = ''; // İçeriği temizle
    title.innerHTML += `<h1>İşte Sana Özel Olarak Hazırladığımız ${totalDays} Günlük Seyahat Planın!!!</h1>`;
    
    const cityIDs = Object.keys(organizedData.locations);
    cityIDs.forEach((cityID, index) => {
        const cityRoutes = organizedData.locations[cityID];

        cityRoutes.forEach(route => {
            const day = route.day;
            const locations = route.locations.map(location =>
                `<li class="list-group-item">Location ID: ${location.locationID}</li>`
            ).join('');
           

            const htmlContent = `
                <div class="cityRoute">
                    <div class="cityRoute-content">
                        <div class="cityRoute-upcontent d-flex">
                            <h3 class="mb-3">${cityID} - ${day}.GÜN</h3>
                            <div class="cityRoute-transports d-flex">
                                <img src="./images/train.png" alt="train">
                                <img src="./images/taxi.png" alt="taxi">
                                <img src="./images/bus.png" alt="bus">
                                <img src="./images/subway.png" alt="subway">
                            </div>
                        </div>
                        <div class="cityRoute-mainContent d-flex">
                            <div class="routePlanner-map" data-city="${cityID}" data-day="${day}"  
                            class="leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom">
                            </div>
                            <div class="cityRoute-locations">
                                <ul class="cityRoute-list list-group">
                                    ${locations}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            clusters.innerHTML += htmlContent;
            
            

        });

        if (index < cityIDs.length - 1) {
            clusters.innerHTML += `<hr style="margin-top: 20px; margin-bottom: 20px;">`;
        }
    });
}


function getTotalDays(organizedData) {
    let totalDays = 0;

    for (const cityID in organizedData.locations) {
        const cityRoutes = organizedData.locations[cityID];
        totalDays += cityRoutes.length;
    }

    return totalDays;
}

function initMaps() {
    const maps = document.querySelectorAll('.routePlanner-map');

    maps.forEach(mapElem => {
        const cityID = mapElem.dataset.city;
        const day = parseInt(mapElem.dataset.day);
        const cityRoutes = organizedData.locations[cityID];
        const route = cityRoutes.find(r => r.day === day);

        const map = L.map(mapElem);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const markers = []; // Separate markers array for each map

        route.locations.forEach((location, i) => {
            
            const locationCoordinatesLat = parseFloat(location.coordinates[0]);
            const locationCoordinatesLong = parseFloat(location.coordinates[1]);
            if(i==0){
                map.setView([locationCoordinatesLat, locationCoordinatesLong], 14);
            }
            const marker = new L.marker([locationCoordinatesLat, locationCoordinatesLong]);
            markers.push(L.latLng(locationCoordinatesLat, locationCoordinatesLong));
            marker.addTo(map);
        });

        L.Routing.control({
            waypoints: markers,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'foot' // Yürüme yollarına göre rota oluştur
            }),
            createMarker: function() { return null; }, // Remove default markers
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);
    });
}

