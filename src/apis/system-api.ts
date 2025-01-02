import Fetch from 'beer-network/api';

class SystemApi extends Fetch {
  async getTreeMenus<T>() {
    return this.get<T>('/admin/system/getTreeMenus');
  }
}

const api = new SystemApi(process.env.REQUEST_BASE_URL || '');
export default api;
