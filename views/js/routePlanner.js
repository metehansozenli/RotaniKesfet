var organizedData;
var locationIDs;
var markers = new Array();

function kMeans(data, k) {
    // Başlangıçta k küme oluşturulur ve rastgele başlangıç merkezleri atanır
    let centroids = [];
    for (let i = 0; i < k; i++) {
        centroids.push([...data[Math.floor(Math.random() * data.length)]]);
    }

    let clusters = Array.from({ length: k }, () => []);
    let prevClusters = null;
    let iteration = 0;

    // Kümeleme işlemi, merkezler değişene kadar devam eder
    while (!arraysEqual(prevClusters, clusters)) {
        prevClusters = clusters.map(arr => [...arr]);
        clusters = Array.from({ length: k }, () => []);

        // Her noktayı en yakın merkeze atar
        for (let point of data) {
            let minDist = Infinity;
            let closestCentroid = null;
            for (let i = 0; i < k; i++) {
                if (centroids[i] !== null) {
                    let dist = distance(point, centroids[i]);
                    if (dist < minDist) {
                        minDist = dist;
                        closestCentroid = i;
                    }
                }
            }
            clusters[closestCentroid].push(point);
        }

        // Yeni merkezleri hesaplar
        for (let i = 0; i < k; i++) {
            const newCentroid = calculateCentroid(clusters[i]);
            if (newCentroid !== null) {
                centroids[i] = newCentroid;
            }
        }

        iteration++;
    }

    return clusters;
}

// İki nokta arasındaki öklid uzaklığını hesaplar
function distance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
}

// Kümenin merkezini hesaplar
function calculateCentroid(cluster) {
    if (cluster.length === 0) return null; // Boş küme kontrolü
    let centroid = new Array(cluster[0].length).fill(0);
    for (let point of cluster) {
        for (let i = 0; i < point.length; i++) {
            centroid[i] += point[i];
        }
    }
    return centroid.map(val => val / cluster.length);
}

// İki dizinin eşit olup olmadığını kontrol eder
function arraysEqual(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) return false;
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) return false;
        }
    }
    return true;
}

// Veriyi almak için kullanılan fonksiyon
const get_initLocationsData = () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/init_routelocationData?routeID=${window.routeID}`);
        request.onload = () => {
            const responseData = JSON.parse(request.responseText);
            //console.log(responseData);
            resolve(responseData); // İşlem tamamlandığında Promise'i çöz
        };

        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });
};

// Koordinatları sayı formatına çevirme
const parseCoordinates = (coord) => {
    let [lat, lon] = coord.split(', ');
    lat = parseFloat(lat.slice(0, -2));
    lon = parseFloat(lon.slice(0, -2));
    if (coord.includes('S')) lat = -lat;
    if (coord.includes('W')) lon = -lon;
    return [lat, lon];
};

// Gün farkını hesaplama
const calculateDayDifference = (startDate, finishDate) => {
    const start = new Date(startDate);
    const finish = new Date(finishDate);
    const diffTime = Math.abs(finish - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// JSON verisini alıp işle
get_initLocationsData().then(data => {
    const coordinates = data.routeLocationCoordinates.map(parseCoordinates);
    const cityIDs = data.locationCityID;
    locationIDs = data.routeLocations;
    // City ID'ye göre gruplama
    const groupedCoords = {};
    cityIDs.forEach((cityID, index) => {
        if (!groupedCoords[cityID]) {
            groupedCoords[cityID] = [];
        }
        groupedCoords[cityID].push(coordinates[index]);
    });

    // KMeans uygulama ve sonuçları JSON formatında oluşturma
    const results = data.routeCityIDs.map((cityID, index) => {
    const k = calculateDayDifference(data.routeStartDates[index], data.routeFinishDates[index]);
    if (groupedCoords[cityID]) {
        const clusters = kMeans(groupedCoords[cityID], k);
        const cityClusters = [];
        clusters.forEach(cluster => {
            const clusterLocations = cluster.map(location => {
                // Her bir koordinat için, ona karşılık gelen lokasyon ID'sini bul
                const locationIndex = coordinates.findIndex(coord => coord[0] === location[0] && coord[1] === location[1]);
                if (locationIndex !== -1) {
                    return {
                        locationID: locationIDs[locationIndex],
                        coordinates: location
                    };
                }
                return null; // Eşleşen lokasyon ID'si bulunamazsa null döndür
            }).filter(location => location !== null); // Null değerleri filtrele
            cityClusters.push(clusterLocations);
        });
        return {
            cityID: cityID,
            clusters: cityClusters
        };
    }
    return null;
}).filter(result => result !== null);

    // Sonuçları JSON formatında oluşturma
    output = {
        userID: data.userID,
        routeID: data.routeID,
        clusters: results
    };

    console.log(JSON.stringify(output, null, 2));
    organizedData = organizeLocationsByDay(output);
    insertHTMLIntoCluster();
    
}).catch(error => {
    console.error(error);
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



async function insertHTMLIntoCluster() {
    const clusters = document.querySelector('.clusters');
    const title = document.querySelector('.routeTitle');
    const totalDays = getTotalDays(organizedData);
    clusters.innerHTML = ''; // İçeriği temizle
    title.innerHTML += `<h1>İşte Sana Özel Olarak Hazırladığımız ${totalDays} Günlük Seyahat Planın!!!</h1>`;
    
    const cityIDs = Object.keys(organizedData.locations);

    const locationNamesData = await load_locationNames(locationIDs);
    
    cityIDs.forEach((cityID, index) => {
        const cityRoutes = organizedData.locations[cityID];
        
        cityRoutes.forEach(route => {
            const day = route.day;
            var locationCityName;
            const locations = route.locations.map(location => {
                // locationID'ye göre locationName'i al
                const locationName = locationNamesData.find(data => data.locationID === location.locationID).locationName;
                locationCityName = locationNamesData.find(data => data.locationID === location.locationID).locationCityName;
                return `<li class="list-group-item">${locationName}</li>`;
            }).join('');
           

            const htmlContent = `
                <div class="cityRoute">
                    <div class="cityRoute-content">
                        <div class="cityRoute-upcontent d-flex">
                            <h3 class="mb-3">${locationCityName} - ${day}.GÜN</h3>
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

    initMaps();
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


const load_locationNames = (locationIds) => {

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/get_locationNames?locationID=${locationIds}`);
        
        request.onload = () => {
            results = JSON.parse(request.responseText);  

            if (results.length > 0) {
                resolve(results); // İşlem tamamlandığında Promise'i çöz
            } else {
                resolve(); // İşlem tamamlandığında Promise'i çöz
            }
        };
        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });

};