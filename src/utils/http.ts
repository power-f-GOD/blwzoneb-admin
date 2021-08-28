/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIBaseURL } from 'src/constants';
import { APIBaseResponse } from 'src/types';

export class Http {
  static token: string | null = null;

  private static returnRequestConfig(
    method: 'GET' | 'POST',
    url: string,
    requiresAuth?: boolean,
    data?: any,
    contentType?: string
  ): AxiosRequestConfig {
    return {
      url: `${APIBaseURL}${url}`,
      method,
      headers: {
        ...(requiresAuth ? { Authorization: `Bearer ${this.token}` } : {}),
        'Content-Type': contentType || 'application/json'
      },
      data,
      validateStatus: (status) => (!/^(2|3|4)/.test(`${status}`) ? false : true)
    };
  }

  /**
   *
   * @param url url of destination e.g. /profile/5df9e8t0wekc/posts ... Base URL should not be included
   * @param requiresAuth if token/authentication will be required for the get action
   */
  static async get<T>(url: string, requiresAuth?: boolean): Promise<APIBaseResponse<T>> {
    const response: AxiosResponse<APIBaseResponse<T>> = await axios(
      Http.returnRequestConfig('GET', url, requiresAuth)
    );

    return Promise.resolve({ ...response.data });
  }

  /**
   *
   * @param url (relative) url of destination e.g. /profile/5df9e8t0wekc/posts ... Base URL should not be included
   * @param data data to be posted to destination
   * @param requiresAuth that is if token/authentication will be required for the get action
   */
  static async post<T, T2 = any>(
    url: string,
    data?: T2,
    requiresAuth?: boolean,
    contentType?: string
  ): Promise<APIBaseResponse<T>> {
    const response: AxiosResponse<APIBaseResponse<T>> = await axios(
      Http.returnRequestConfig('POST', url, requiresAuth, data, contentType)
    );

    return Promise.resolve({ ...response.data });
  }
}
