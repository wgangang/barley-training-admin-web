import Fetch from 'beer-network/api';

class TeacherTitleApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/teacher/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/teacher/title/' + id);
  }
}

const api = new TeacherTitleApi((process.env.REQUEST_BASE_URL || '') + '/barley');
export default api;
