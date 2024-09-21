import Fetch from 'beer-network/api';

class PromiseApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/mall/spu/promise/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete<boolean>('/mall/spu/promise/' + id);
  }
}

const api = new PromiseApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
