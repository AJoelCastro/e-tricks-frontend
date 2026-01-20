import axios from 'axios';
import { ICoupon } from '@/interfaces/Coupon';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface CouponValidationResponse {
    success: boolean;
    data: ICoupon;
    message?: string;
}


const CouponService = {
   
    validateCoupon: async (token: string, code: string): Promise<CouponValidationResponse> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        try {
            const response = await axios.post(`${API_URL}/coupon/validate`, { code }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
           console.log("response data",response.data)
            return response.data;
        } catch (error) {
            console.error('Error validating coupon:', error);
            throw error;
        }
    },

    /**
     * Creates a new coupon
     * @param {string} token - Authentication token (admin required)
     * @param {Omit<ICoupon, '_id'>} couponData - Coupon data to create
     * @returns {Promise<ICoupon>} Created coupon data
     */
    createCoupon: async (token: string, couponData: Omit<ICoupon, '_id'>): Promise<ICoupon> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        try {
            const response = await axios.post(`${API_URL}/coupon`, couponData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating coupon:', error);
            throw error;
        }
    },

    /**
     * Lists all coupons (admin only)
     * @param {string} token - Authentication token (admin required)
     * @returns {Promise<ICoupon[]>} Array of coupons
     */
    listCoupons: async (token: string): Promise<ICoupon[]> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        try {
            const response = await axios.get(`${API_URL}/coupon`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error listing coupons:', error);
            throw error;
        }
    }
};

export default CouponService;