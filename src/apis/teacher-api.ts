import Fetch from 'beer-network/api';

class TeacherApi extends Fetch {
  async save(params: any) {
    return this.postBody('/teacher-info/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/teacher-info/' + id);
  }

  async saveTitle(params: {}) {
    return this.postBody('/teacher/title/save', undefined, params);
  }

  async removeTitle(id: string) {
    return this.delete('/teacher/title/' + id);
  }

  async saveCertificate(params: {}) {
    return this.postBody('/teacher/certificate/save', undefined, params);
  }

  async removeCertificate(id: string) {
    return this.delete('/teacher/certificate/' + id);
  }

  async saveEvaluation(params: {}) {
    return this.postBody('/teacher/evaluation/save', undefined, params);
  }

  async removeEvaluation(id: string) {
    return this.delete('/teacher/evaluation/' + id);
  }
}

const api = new TeacherApi((process.env.REQUEST_BASE_URL || ''));
export default api;
