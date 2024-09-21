import Fetch from 'beer-network/api';

class SupplierApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/supplier/audit/save', undefined, params);
  }

  async disable(id: string) {
    return this.post<boolean>('/supplier/disable/' + id);
  }

  async enable(id: string) {
    return this.post<boolean>('/supplier/enable/' + id);
  }

  async revoke(id: string) {
    return this.postBody<boolean>('/supplier/audit/auditRevoke', undefined, { auditId: id });
  }

  async agree(id: string) {
    return this.postBody<boolean>('/supplier/audit/auditAgree', undefined, { auditId: id });
  }

  async reject(id: string, auditRejectReason: string) {
    return this.postBody<boolean>('/supplier/audit/auditReject', undefined, {
      auditId: id,
      auditRejectReason
    });
  }
}

const api = new SupplierApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
