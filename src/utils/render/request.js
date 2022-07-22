import axios from "axios";
import {appConfig} from "@/utils/main/config";

export const request = axios.create({
  timeout:10000,
})
