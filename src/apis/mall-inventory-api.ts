import Fetch from 'beer-network/api';

class MallInventoryApi extends Fetch {

  async frozen(id: string) {
    return this.post<boolean>('/mall/inventory/batch/notSell/' + id, undefined);
  }

  async invalid(id: string) {
    return this.post<boolean>('/mall/inventory/batch/disabled/' + id, undefined);
  }

  async sell(id: string) {
    return this.post<boolean>('/mall/inventory/batch/sell/' + id, undefined);
  }
}

const api = new MallInventoryApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
