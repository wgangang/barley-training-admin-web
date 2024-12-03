import Fetch from 'beer-network/api';

class ProjectFundsApi extends Fetch {
  async save(params: {}) {
    return this.postBody('/project/funds/save', undefined, params);
  }
}

const api = new ProjectFundsApi((process.env.REQUEST_BASE_URL || ''));
export default api;
