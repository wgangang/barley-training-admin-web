import Fetch from 'beer-network/api';

class ClassroomApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/admin/classroom/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/admin/classroom/' + id);
  }

  async saveReservation(params: any) {
    return this.postBody('/admin/classroom/reservation/save', undefined, params);
  }

  async removeReservation(id: string) {
    return this.delete('/admin/classroom/reservation/' + id);
  }

  async inspect<T>() {
    return this.get<T>('/admin/classroom/inspect');
  }
}

const api = new ClassroomApi((process.env.REQUEST_BASE_URL || ''));
export default api;
