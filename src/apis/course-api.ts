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
    return this.get<boolean>('/admin/course/live/' + id);
  }

  async liveDelete(id: string) {
    return this.delete<boolean>('/admin/course/live/' + id);
  }

  async liveDetail<T>(id: string) {
    return this.get<T>('/admin/course/live/detail/' + id);
  }

  async listCourse<T>(id: string) {
    return this.get<T>('/admin/course/list/' + id);
  }

  async video<T>(id: string) {
    return this.get<T>('/admin/course/video/' + id);
  }
}

const api = new CourseApi((process.env.REQUEST_BASE_URL || ''));
export default api;
