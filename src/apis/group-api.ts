import Fetch from 'beer-network/api';

class GroupApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/group/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete<boolean>('/group/' + id);
  }
}

const api = new GroupApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
