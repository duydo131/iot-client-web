import axios from 'axios';
import { URL_API } from '../common/constants';

const call_api = ({ url, method, data, params }) =>
    axios.create({
        baseURL: URL_API,
        headers: {
            'Bearer': `${localStorage.getItem('token')}`,
        },
    })({
        method,
        url,
        data,
        params,
    })

export default call_api;