import Fetch from 'beer-network/api';

class ContractApi extends Fetch {
  async save(params: {}) {
    return this.postBody<boolean>('/purchase/contract/audit/save', undefined, params);
  }

  async revoke(id: string) {
    return this.postBody<boolean>('/purchase/contract/audit/auditRevoke', undefined, { auditId: id });
  }

  async agree(id: string) {
    return this.postBody<boolean>('/purchase/contract/audit/auditAgree', undefined, { auditId: id });
  }

  async reject(id: string, auditRejectReason: string) {
    return this.postBody<boolean>('/purchase/contract/audit/auditReject', undefined, {
      auditId: id,
      auditRejectReason
    });
  }
}

const api = new ContractApi((process.env.REQUEST_BASE_URL || '') + '/supply-chain');
export default api;
