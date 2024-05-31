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
            console.log(responseData);
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
            return {
                cityID: cityID,
                clusters: clusters
            };
        }
        return null;
    }).filter(result => result !== null);

    // Sonuçları JSON formatında oluşturma
    const output = {
        routeCreationDate: data.routeCreationDate,
        userID: data.userID,
        routeID: data.routeID,
        clusters: results
    };

    console.log(JSON.stringify(output, null, 2));
}).catch(error => {
    console.error(error);
});
// function groupByCityID(responseData) {
//     const groupedData = {};
    
//     responseData.forEach(route => {
//         route.routeLocations.forEach((location, index) => {
//         const cityID = route.locationCityID[index];
//         if (!groupedData[cityID]) {
//             groupedData[cityID] = [];
//         }
    
//         groupedData[cityID].push({
//             locationID: location,
//             coordinates: route.routeLocationCoordinates[index],
//             cityID: cityID
//         });
//         });
//     });
    
//     return groupedData;
//     }
    
//     const groupedByCityID = groupByCityID(responseData);
//     console.log(groupedByCityID);

    

// get_initLocationsData(itemText).then((locationID) => {
//     return locationID; // resolve edilen değeri döndür
// }).catch((error) => {
//     console.error('Hata:', error);
//     return null; // Hata durumunda null döndür
// })

// let k = 2;
// let result = kMeans(data, k);

