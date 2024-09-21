import Fetch from 'beer-network/api';

class MallApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/mall/spu/category/save', undefined, params);
  }

  async deleteById(id: string) {
    return this.delete<boolean>(`/mall/spu/category/${id}`);
  }
}

const api = new MallApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
