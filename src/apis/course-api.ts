import Fetch from 'beer-network/api';

class CourseApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/admin/course/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/admin/course/' + id);
  }

  async saveTeacherPrice(params: {}) {
    return this.postBody('/admin/course/teacher-price/save', undefined, params);
  }

  async removeTeacherPrice(id: string) {
    return this.delete('/admin/course/teacher-price/' + id);
  }

  async live(id: string) {
    return this.get('/admin/course/live/' + id);
  }

  async liveDelete(id: string) {
    return this.delete('/admin/course/live/' + id);
  }

  async liveDetail(id: string) {
    return this.get('/admin/course/live/detail/' + id);
  }
}

const api = new CourseApi((process.env.REQUEST_BASE_URL || ''));
export default api;
