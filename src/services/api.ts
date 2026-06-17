import axios from "axios";

const API_URL = "http://192.168.100.33:5000";
//  :5000 - the port number the Express server listen on. Matches app.listen(500) in app.ts

export const API = axios.create({ // create a pre-configured Axios instance. All calls using this instance auto prepend the baseURL
    baseURL: API_URL, // so API.get("/queue" becomes http:/192.168.100.33:500/queue)
});