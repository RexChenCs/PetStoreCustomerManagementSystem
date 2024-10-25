// TEST
const firebaseConfig = {
    apiKey: "AIzaSyBculKhEzFwrrXjBhME1Up5uFlurniexQQ",
    authDomain: "file:///Users/rexchen/Desktop/PetHomeVIPSystem",
    databaseURL: "https://pethometestenv-default-rtdb.firebaseio.com",
    projectId: "pethometestenv",
    storageBucket: "pethometestenv.appspot.com",
    messagingSenderId: "1084724497714",
    appId: "1:1084724497714:web:4ec4930ec0818743291b2b",
    measurementId: "G-KV5F575K29"
};

firebase.initializeApp(firebaseConfig);
let authDomain = firebaseConfig['authDomain'];