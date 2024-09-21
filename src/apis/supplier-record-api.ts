import Fetch from 'beer-network/api';

class SupplierRecordApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/supplier/balance/record/audit/save', undefined, params);
  }

  async revoke(id: string) {
    return this.postBody<boolean>('/supplier/balance/record/audit/auditRevoke', undefined, { auditId: id });
  }

  async agree(id: string) {
    return this.postBody<boolean>('/supplier/balance/record/audit/auditAgree', undefined, { auditId: id });
  }

  async reject(id: string, auditRejectReason: string) {
    return this.postBody<boolean>('/supplier/balance/record/audit/auditReject', undefined, {
      auditId: id,
      auditRejectReason
    });
  }

  async pay(param: {}) {
    return this.postBody<boolean>('/supplier/balance/record/payment', undefined, param);
  }
}

const api = new SupplierRecordApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
