import Fetch from 'beer-network/api';

class ProjectApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/project/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/project/' + id);
  }

  async saveClass(params: {}) {
    return this.postBody('/project/class/save', undefined, params);
  }

  async removeClass(id: string) {
    return this.delete('/project/class/' + id);
  }
}

const api = new ProjectApi((process.env.REQUEST_BASE_URL || '') + '/barley');
export default api;
