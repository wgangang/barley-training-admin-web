import Fetch from 'beer-network/api';

class PurchaseGoodsApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/mall/purchase/spu/audit/save', undefined, params);
  }

  async revoke(id: string) {
    return this.postBody<boolean>('/mall/purchase/spu/audit/auditRevoke', undefined, { auditId: id });
  }

  async agree(id: string) {
    return this.postBody<boolean>('/mall/purchase/spu/audit/auditAgree', undefined, { auditId: id });
  }

  async reject(id: string, auditRejectReason: string) {
    return this.postBody<boolean>('/mall/purchase/spu/audit/auditReject', undefined, {
      auditId: id,
      auditRejectReason
    });
  }
}

const api = new PurchaseGoodsApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
