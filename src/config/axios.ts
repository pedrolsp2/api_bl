import axios, { AxiosError } from 'axios';

const useAxios = {
  async POST(url: string, body?: any) {
    try {
      const { data, status } = await axios.post(url, body);
      return { data, status };
    } catch (error) {
      const erro = error as AxiosError;
      return { error: erro.message, status: erro.response?.status };
    }
  },
};

export default useAxios;
