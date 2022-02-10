window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};

function initializeApp(data) {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;
    

    // work call
    document.getElementById('workbutton').addEventListener('click', getLocation);
    
    // offwork call
    document.getElementById('offworkbutton').addEventListener('click', getLocation);

    // closeWindow call
    document.getElementById('closewindowbutton').addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        liff.sendMessages([{
            type: 'text',
            text: "You've successfully sent a message! Hooray!"
        }, {
            type: 'sticker',
            packageId: '2',
            stickerId: '144'
        }]).then(function () {
            window.alert("Message sent");
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });
    });

    // get access token
    document.getElementById('getaccesstoken').addEventListener('click', function () {
        const accessToken = liff.getAccessToken();
        document.getElementById('accesstokenfield').textContent = accessToken;
        toggleAccessToken();
    });

    // get profile call
    document.getElementById('getprofilebutton').addEventListener('click', function () {
        liff.getProfile().then(function (profile) {
            document.getElementById('useridprofilefield').textContent = profile.userId;
            document.getElementById('displaynamefield').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilepicturediv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = "Profile Picture";
            profilePictureDiv.appendChild(img);

            document.getElementById('statusmessagefield').textContent = profile.statusMessage;
            toggleProfileData();
        }).catch(function (error) {
            window.alert("Error getting profile: " + error);
        });
    });
}

function toggleAccessToken() {
    toggleElement('accesstokendata');
}

function toggleProfileData() {
    toggleElement('profileinfo');
}

function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
}

function getLocation() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {

    const bubble = {};  
    const getUrlString = location.href;
    const url = new URL(getUrlString);  
    const parameter = {};
    const latlon = position.coords.latitude + "," + position.coords.longitude;
    const date = new Date(position.timestamp );    

  if (url.searchParams.get("punch")=="work"){
    bubble = 
    {        
      events:{
        type:"message",        
        message: {
          type:"work",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        }
      }    
    };
  } else {
     bubble = 
    {            
      events:{
        type:"message",        
        message: {
          type:"outwork",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        }
      }     
    };
  }
  
    //document.getElementById("map-link").innerHTML = JSON.stringify(bubble);
  parameter = {
    url: "https://docs.google.com/spreadsheets/d/1P2DOGsridwK4zMhwKw-Xokjgwht7FjuTs9Yf2XhN-aI/edit#gid=0",
    name: "Location",
    data: JSON.stringify(bubble),
    row: Object.keys(bubble).length,
    column: Object.keys(bubble.events.message).length,
    insertType: "bottom"
  };
  
  $.get("https://script.google.com/macros/s/AKfycbw1X6eY1UFUTQnuxXmqEj82BiiymItZae66x89OoKz-UNE4e-9FH4AyFx9iHgXL3pz6/exec", parameter);
    document.getElementById("map-link").innerHTML = "打卡完成："+ latlon;
    const ret= document.getElementById("map-link");
    document.getElementById("demo").innerHTML = ret.value;
}
  
function showError(error) {
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("demo").innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("demo").innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      document.getElementById("demo").innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("demo").innerHTML = "An unknown error occurred."
      break;
  }
}