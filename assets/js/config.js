const firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomainm",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "G-measurementId"
};

firebase.initializeApp(firebaseConfig);
let authDomain = firebaseConfig['authDomain'];