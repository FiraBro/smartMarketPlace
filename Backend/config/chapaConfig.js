import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const chapa = axios.create({
  baseURL: "https://api.chapa.co/v1",
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export default chapa;
