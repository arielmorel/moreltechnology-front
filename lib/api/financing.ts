import axios from "axios";
import { getFinancingUrl } from "./config";

const FINANCING_API_URL = getFinancingUrl();
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN || "smartbusiness-public-web-key-2026";

export interface FinancingRequest {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  monthlyIncome: number;
  workplaceName: string;
  workplaceAddress: string;
  monthlyExpenses: number;
  productId: string;
  productName: string;
  productPrice: number;
  downPayment: number;
  termMonths: number;
}

export const createFinancingRequest = async (request: FinancingRequest): Promise<{ success: boolean; message: string }> => {
  try {
    await axios.post(FINANCING_API_URL, request, {
      headers: {
        "X-Public-App-Token": APP_TOKEN,
      },
    });
    return { success: true, message: "Solicitud enviada correctamente" };
  } catch (error) {
    console.error("Error creating financing request:", error);
    return { success: false, message: "Error al enviar la solicitud" };
  }
};