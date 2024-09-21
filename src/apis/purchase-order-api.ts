import Fetch from 'beer-network/api';

class PurchaseOrderApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/mall/purchase/order/audit/save', undefined, params);
  }

  async revoke(id: string) {
    return this.postBody<boolean>('/mall/purchase/order/audit/auditRevoke', undefined, { auditId: id });
  }

  async agree(id: string) {
    return this.postBody<boolean>('/mall/purchase/order/audit/auditAgree', undefined, { auditId: id });
  }

  async reject(id: string, auditRejectReason: string) {
    return this.postBody<boolean>('/mall/purchase/order/audit/auditReject', undefined, {
      auditId: id,
      auditRejectReason
    });
  }
}

const api = new PurchaseOrderApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
