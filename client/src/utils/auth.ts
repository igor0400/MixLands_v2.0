import axios from 'axios';
import { ResponseType } from './types';
import {
   userLogin,
   setLoading,
   userLogout,
   setError,
} from '../slices/userSlice';

import { proxy } from '../config';

export async function login(
   nickname: string,
   password: string,
   navigate: Function,
   fromPage: string
) {
   let response: ResponseType = { status: 500, data: '' };

   await axios
      .post(
         `${proxy}/auth/login`,
         { nickname, password, userAgent: navigator.userAgent },
         { withCredentials: true }
      )
      .then((res) => {
         const body = res.data;
         navigate(fromPage);
         localStorage.setItem('token', body.accessToken);
         response = { status: 200, data: body.user };
      })
      .catch((err) => {
         response = {
            status: err.response.status,
            data: err.response?.data?.message || err.message,
         };
      });

   return response;
}

export async function refresh(dispatch: Function) {
   dispatch(setLoading(true));

   await axios
      .post(
         `${proxy}/auth/refresh`,
         {
            userAgent: navigator.userAgent,
         },
         { withCredentials: true }
      )
      .then((res) => {
         const data = res.data;
         dispatch(userLogin(data.user));
         localStorage.setItem('token', data.accessToken);
      })
      .catch(() => {
         localStorage.removeItem('token');
         dispatch(userLogout());
      })
      .finally(() => dispatch(setLoading(false)));
}

export async function pageRefresh(dispatch: Function) {
   dispatch(setLoading(true));

   await axios
      .post(
         `${proxy}/auth/refresh`,
         { userAgent: navigator.userAgent },
         { withCredentials: true }
      )
      .catch((e) => {
         console.log(e);
         if (e.code === 'ERR_NETWORK') {
            dispatch(setError(true));
         } else {
            localStorage.removeItem('token');
            dispatch(userLogout());
         }
      })
      .finally(() => dispatch(setLoading(false)));
}

export async function getNewToken() {
   try {
      const { data } = await axios.post(
         `${proxy}/auth/refresh`,
         {
            userAgent: navigator.userAgent,
         },
         { withCredentials: true }
      );

      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
   } catch (e) {
      localStorage.removeItem('token');
   }
}
