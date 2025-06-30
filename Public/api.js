import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/flights"; // Your backend URL

export const searchFlights = async (searchParams) => {
  const response = await axios.post(`${API_BASE_URL}/search`, searchParams);
  return response.data;
};

export const getFlightOffers = async (offerRequestId) => {
  const response = await axios.get(`${API_BASE_URL}/offers`, {
    params: { offer_request_id: offerRequestId },
  });
  return response.data;
};

export const bookFlight = async (bookingData) => {
  const response = await axios.post(`${API_BASE_URL}/book`, bookingData);
  return response.data;
};
