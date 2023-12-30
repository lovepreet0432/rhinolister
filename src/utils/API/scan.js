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

export const scanProduct = async (barcodeNumber, planId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/scan`,
            { upc: barcodeNumber, planId: planId },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response;
    } catch (error) {
        return error.response;
    }
}


export const checkUserCanScan = async (userId, planId) => {
    try {
        const response = await axios.get(API_BASE_URL + `/checkUserCanScan/${userId}/${planId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getScanData = async (userId,filterDate) => {
    try {
        const response = await axios.get(API_BASE_URL + `/scan-history/${userId}/${filterDate}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const loadNewBatch = async (userId,startDate) => {
    try {
        const response = await axios.get(API_BASE_URL + `/scan-history-new-batch/${userId}/${startDate}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteParticularScan = async (userId,scanId,date) => {
    try{
        const response=await axios.delete(API_BASE_URL + `/scan-history-delete/${userId}/${scanId}/${date}`);
        return response;
    }catch(error)
    {
        return error.response;
    }
}

export const filterScanByDate = async (formattedStartDate,userId) => {
    try{
    const response=axios.post(API_BASE_URL + `/filter-scan-history`, { 'date': formattedStartDate,'userId':userId }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
      return response; 
    }
    catch(error) {
        return error.response;
    }
}

export const scanHistoryData = async (mainApiResponse, userId) => {
    try {

        const response = await axios.post(
            `${API_BASE_URL}/scan-history`,
            {
                scan_id: mainApiResponse.data.Identifier,
                title: mainApiResponse.data.Title,
                description:mainApiResponse.data.Desc,
                price: mainApiResponse.data.AveragePrice,
                qty: 1,
                user_id: userId,
                product_info: mainApiResponse.data,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        return error.response;
    }
};

export const scanEditing = async (date,formData, userID) => {
    try {

        const response = await axios.post(
            `${API_BASE_URL}/scan-edit`,
            { 
                date:date,
                scan_id: formData.identifier,
                user_id: userID, 
                title: formData.title, 
                price: formData.price, 
                qty: formData.quantity 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        return error.response;
    }
};
 

export const manuallyEnterScanItem = async (formData, userId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/scan-history`,
            {
                'scan_id': formData.identifier,
                'title': formData.title,
                'price': formData.price,
                'description':formData.description,
                'qty': parseInt(formData.quantity),
                'user_id': userId,
                'product_info': { "Title": formData.title,"Identifier":formData.identifier,"Desc":formData.description },
                'manually':true
              },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        return error.response;
    }
};
