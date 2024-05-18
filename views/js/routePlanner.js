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




const get_initLocationsData = () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `/init_routelocationData?routeID=${window.routeID}`);
        request.onload = () => {
            responseData = JSON.parse(request.responseText); 
            const results2 = responseData.locationData;
            const results3 = responseData.routeData;
            console.log(responseData)
            resolve(); // İşlem tamamlandığında Promise'i çöz
        };
    
        request.onerror = () => {
            reject('İstek başarısız');
        };
        request.send();
    });
    
    }
    

get_initLocationsData(itemText).then((locationID) => {
    return locationID; // resolve edilen değeri döndür
}).catch((error) => {
    console.error('Hata:', error);
    return null; // Hata durumunda null döndür
})

let k = 2;
let result = kMeans(data, k);
console.log(result);

