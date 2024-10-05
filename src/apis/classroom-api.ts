import Fetch from 'beer-network/api';

class ClassroomApi extends Fetch {

  async save(params: {}) {
    return this.postBody('/classroom/save', undefined, params);
  }

  async remove(id: string) {
    return this.delete('/classroom/' + id);
  }

  async saveReservation(params: any) {
    return this.postBody('/classroom/reservation/save', undefined, params);
  }

  async removeReservation(id: string) {
    return this.delete('/classroom/reservation/' + id);
  }
}

const api = new ClassroomApi((process.env.REQUEST_BASE_URL || '') + '/barley');
export default api;
