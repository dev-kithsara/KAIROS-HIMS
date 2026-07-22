import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/incidents";

export const createIncident = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
