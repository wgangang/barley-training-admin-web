import Fetch from 'beer-network/api';

class DeviceInfoApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/admin/device-info/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/admin/device-info/' + id);
  }
}

const api = new DeviceInfoApi((process.env.REQUEST_BASE_URL || ''));
export default api;
