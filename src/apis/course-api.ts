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
}

const api = new CourseApi((process.env.REQUEST_BASE_URL || ''));
export default api;
