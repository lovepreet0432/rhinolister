import axios from 'axios';
import { API_BASE_URL } from '../../Constants';

export const scanProductNonLogin = async () => {
    try {
        const response = await axios.get(API_BASE_URL + "/scan-product", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getShopifyData = async (userId, accessToken) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/get-shopify-data`,
            { user_id: userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getEbayData = async (userId, accessToken) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/get-ebay-data`,
            { user_id: userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}



export const saveServices = async (exportName, exportValue, userId, accessToken) => {
    try {
        const requestData = {
            exportName,
            exportValue,
            user_id: userId,
        };

        const response = await axios.post(
            `${API_BASE_URL}/account-settings`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}

export const saveShopifyData = async (formData, shopify, userId, accessToken) => {
    try {
        // Create an object containing the data you want to send to the API
        const requestData = {
            user_id: userId,
            shopify_url: formData.shopify_url,
            access_token: formData.access_token,
            shopify: shopify
        };

        const response = await axios.post(
            `${API_BASE_URL}/shopify-store-api`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}

export const sendToShopifyStore = async (scanHistory, userId, discount, accessToken) => {
    try {
          const response = await axios.post(API_BASE_URL + '/shopify-store', { scanHistory: scanHistory, user_id: userId, discount: discount }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${atob(accessToken)}`
                    },
                });
        return response;
    } catch (error) {
        return error.response;
    }
}


export const saveEbayData = async (ebayData, ebay, userId, accessToken) => {
    try {
        // Create an object containing the data you want to send to the API
        const requestData = {
            user_id: userId,
            ebay: ebay, 
            client_id: ebayData.client_id,
            client_secret: ebayData.client_secret,
            redirect_uri: ebayData.redirect_uri
        };

        const response = await axios.post(
            `${API_BASE_URL}/ebay-store`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}


export const saveHibidData = async (optionData, hibid, userId, accessToken) => {
    try {
        // Create an object containing the data you want to send to the API
        const requestData = {
            user_id: userId,
            seller: optionData.seller,
            sellerCode: optionData.sellerCode,
            hibid: hibid
        };

        const response = await axios.post(
            `${API_BASE_URL}/hibid-store`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${atob(accessToken)}`
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}