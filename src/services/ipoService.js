
import  apiRequest  from "./api";

export async function getIPOListings() {
  return await apiRequest("/ipos");
}
