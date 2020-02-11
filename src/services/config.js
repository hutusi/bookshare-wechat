const devURL = "http://localhost:3000/api/v1";
const prodURL = "https://zhimaishu.com/api/v1";
const BASE_URL = process.env.NODE_ENV === "development" ? devURL : prodURL;

export default BASE_URL;
