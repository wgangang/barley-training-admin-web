import Fetch from 'beer-network/api';

class NetDiskApi extends Fetch {
  async getNetDiskDirectoryItem<T>(app: string | undefined, parentId: string) {
    return this.get<T>('/usercenter/disk/getDirectoryList', {
      app,
      parentId
    }, undefined);
  }

  async saveNetDisk(app: string, parentId: string, exportId: string) {
    return this.postBody<boolean>('/report/export/saveNetDisk', {
      app,
      parentId,
      exportId
    }, undefined);
  }
}

const api = new NetDiskApi(process.env.REQUEST_BASE_URL || '');
export default api;
