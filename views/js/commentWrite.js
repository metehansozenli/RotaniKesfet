let starContainer = document.querySelectorAll(".star-container");
const submitbutton = document.querySelector("#submit");
const message = document.querySelector("#message");
const submitSection = document.querySelector("#submit-section");


//events for touch and mous
let events = {
    mouse: {
        over: "click",
    },
    touch: {
        over: "touchstart",
    }
};

let deviceType = "";

//detect touch device
const isTouchDevice = () => {
    try {
        // We try to create TouchEvent (İt would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch (e) {
        deviceType = "mouse";
        return false;
    }

};

isTouchDevice();

starContainer.forEach((element, index) => {
    element.addEventListener (events[deviceType].over, () => {

        submitbutton.disabled = false;
        if (element.classList.contains("inactive")) {
            // Fill star
            ratingUpdate(0, index, true);
        } else {
            //Regular stars (remove color)
            ratingUpdate(index, (starContainer.length)-1, false);
        }

    });

});

const ratingUpdate = (start, end, active) => {
    
    for (let i = start; i<=end; i++) {

        if (active) {
            starContainer[i].classList.add("active");
            starContainer[i].classList.remove("inactive");
            starContainer[i].firstElementChild.className = "fa-star fa-solid";
        } else {
            starContainer[i].classList.remove("active");
            starContainer[i].classList.add("inactive");
            starContainer[i].firstElementChild.className = "fa-star fa-regular";
        }
    }



    // Message

    let activeElements = document.getElementsByClassName("active");

    if (activeElements.length > 0) {
        
        switch (activeElements.length) {
            case 1:
                message.innerText = "Berbat";
                break;
            case 2:
                message.innerText = "Kötü";
                break;
            case 3:
                message.innerText = "Ortalama";
                break;
            case 4:
                message.innerText = "Çok İyi";
                break;
            case 5:
                message.innerText = "Mükemmel";
                break;
        }
    }

    else {
        message.innerText = "";
    }

};