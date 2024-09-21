import Fetch from 'beer-network/api';

class BrandApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/brand/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete<boolean>('/brand/' + id);
  }
}

const api = new BrandApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
