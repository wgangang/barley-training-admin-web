import Fetch from 'beer-network/api';

class ProjectApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/admin/project/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/admin/project/' + id);
  }

  async saveClass(params: {}) {
    return this.postBody('/admin/project/class/save', undefined, params);
  }

  async removeClass(id: string) {
    return this.delete('/admin/project/class/' + id);
  }
}

const api = new ProjectApi((process.env.REQUEST_BASE_URL || ''));
export default api;
