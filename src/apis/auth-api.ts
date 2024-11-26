import Fetch from 'beer-network/api';

class AuthApi extends Fetch {
  async getSliderImageCode<T>() {
    return this.get<T>('/auth/getSliderImageCode');
  }

  async login(params: {}) {
    return this.postBody<boolean>('/auth/login', undefined, params);
  }

  async getUserInfo<T>() {
    return this.get<T>('/auth/get');
  }
}

const api = new AuthApi(process.env.REQUEST_BASE_URL || '');
export default api;
