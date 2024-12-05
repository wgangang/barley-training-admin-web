import Fetch, { JsonResponse, Option } from 'beer-network/api';

class S3Api extends Fetch {
  async getDownloadUrl(fileName: string, key: string, option?: Option) {
    return this.get<string>('/s3/getDownloadUrl', {
      fileName,
      key
    }, undefined, option);
  }

  async getUrl(key: string | undefined) {
    if (key === undefined || key === null || key === '' || !key.toString()
      .startsWith('s3://')) {
      return {
        data: key,
        success: true
      } as JsonResponse<string>;
    }
    return this.cache('S3_CACHE_' + key, () => this.get<string>('/s3/getUrl', { key }), 60, true);
  }

  async getUrls(keys: string[], type?: string) {
    return this.postBody<string[]>('/s3/getUrls', { type: type || 'COVER_MIN' }, keys);
  }
}

const api = new S3Api(process.env.REQUEST_BASE_URL || '');
export default api;
