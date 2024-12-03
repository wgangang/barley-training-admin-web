import Fetch from 'beer-network/api';

class ProjectFundsFlowApi extends Fetch {
  async save(params: {}) {
    return this.postBody('/project/funds/flow/save', undefined, params);
  }
}

const api = new ProjectFundsFlowApi((process.env.REQUEST_BASE_URL || ''));
export default api;
