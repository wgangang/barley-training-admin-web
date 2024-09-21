import Fetch, { JsonResponse, Option } from 'beer-network/api';
import s3Api from '@apis/s3-api';

class ReportApi extends Fetch {
  search<T>(code: string, params: {}, option?: Option): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postBody<any>('/report/query/search/' + code, undefined, this.pageParams(params), undefined, option)
        .then(result => {
          if (!result.success) {
            reject(result.message);
            return;
          }
          if (result.data !== undefined) {
            const s3Items = result.data?.records?.map((it: any) => {
              const items = [];
              for (const key of Object.keys(it)) {
                const value = it[key];
                if (value !== undefined && value !== null && typeof value === 'string' && value.startsWith('s3://')) {
                  items.push(value);
                }
              }
              return items;
            });
            const array = s3Items.flat();
            const uniqueArray: string[] = array.filter((item: string, index: number) => {
              return array.indexOf(item) === index;
            });
            if (uniqueArray.length > 0) {
              s3Api.getUrls(uniqueArray)
                .then(it => it.data)
                .then(s3List => {
                  result.data = result.data?.records?.map((it: any) => {
                    for (const key of Object.keys(it)) {
                      const value = it[key];
                      if (value !== undefined && value !== null && typeof value === 'string' && value.startsWith('s3://')) {
                        const index = uniqueArray.findIndex(a => a === value);
                        it['s3_' + key] = it[key];
                        it[key] = s3List[index] || it[key];
                      }
                    }
                    return it;
                  });
                  this.convert(result)
                    .then(it => resolve(it));
                });
              return;
            }
          }
          this.convert(result)
            .then(it => resolve(it));
        });
    });
  }

  private async convert<T>(result: JsonResponse<{}>) {
    return this.pageTable<T>(result)
      .then(data => {
        return {
          ...data,
          data: data.data?.map((a, index) => {
            const b: any = a;
            if (b.id === undefined) {
              return {
                ...a,
                id: index.toFixed()
              };
            }
            return a;
          })
        };
      });
  }

  async getConfig<T>(code: string, option?: Option) {
    return this.get<T>('/report/page/' + code, undefined, undefined, option);
  }

  async getStatistics<T>(code: string, params?: {}, option?: Option) {
    return this.postBody<T>('/report/query/' + code, undefined, params, option);
  }

  async getDataList<T>(code: string, params?: {}, option?: Option) {
    return this.postBody<T>('/report/query/list/' + code, {}, params, option);
  }

  async export<T>(code: string, exportCode: string, name: string, params: {}, option?: Option) {
    return this.postBody<T>('/report/export/' + code, {
      name,
      exportCode
    }, params, undefined, option);
  }

  async getExportTaskList<T>(code: string, option?: Option) {
    return this.get<T>('/report/export/getExportTaskList/' + code, undefined, undefined, option);
  }

  async getImportTaskList<T>(code: string, option?: Option) {
    return this.get<T>('/report/import/getImportTaskList/' + code, undefined, undefined, option);
  }

  async import<T>(code: string, importCode: string, fileName: string, option?: Option) {
    return this.postBody<T>('/report/import/startImport/' + code, undefined, {
      importCode,
      fileName
    }, option);
  }

  async importItems<T>(importId: string, items: {}[], option?: Option) {
    return this.postBody<T>('/report/import/upload', undefined, {
      importId,
      value: items
    }, option);
  }

  async importFinish<T>(importId: string, option?: Option) {
    return this.postBody<T>('/report/import/finish', { importId }, undefined, option);
  }
}

const api = new ReportApi(process.env.REQUEST_BASE_URL || '');
export default api;

export const AutoTableRequest = {
  app: undefined,
  search: async (code: string, params: {}, option: Option | undefined) => api.search(code, params, option),
  config: async (code: string, option?: Option) => api.getConfig(code, option)
    .then(result => {
      const original = (result?.data as any);
      const data = original?.page?.[0];
      if (data !== undefined) {
        data.code = original.code;
        data.name = original.name;
      }
      return {
        ...result,
        data
      };
    }),
  statistics: async (code: string, _params: {}, option?: Option) => api.getStatistics(code, option),
  dataList: async (code: string, params: {}, option?: Option) => api.getDataList(code, params, option),
  exportTaskList: async (code: string, option?: Option) => api.getExportTaskList(code, option),
  importTaskList: async (code: string, option?: Option) => api.getImportTaskList(code, option),
  importData: async (code: string, importCode: string, data: any, callback: (progress: number) => void, option?: Option) => {
    const result = await api.import<string>(code, importCode, data.fileName, option);
    if (!result.success) {
      return result;
    }
    const importId = result.data;
    const items: {}[] = [];
    const chunkSize = 5000;
    for (const sheet of data.sheets) {
      sheet.items.map((it: any) => {
        return {
          ...it,
          ___sheetName: sheet.name,
          ___sheetIndex: sheet.index
        };
      })
        .forEach((it: any) => items.push(it));
    }
    let packageIndex = 0;
    const chunkLength = Math.ceil(data.sheets[0].items.length / chunkSize);
    callback?.(3);
    for (let i = 0; i < items.length; i += chunkSize) {
      /* eslint-disable no-await-in-loop */
      const result = await api.importItems(importId, items.slice(i, i + chunkSize), option);
      if (!result.success) {
        return result;
      }
      packageIndex += 1;
      callback?.(Math.min(Math.ceil((packageIndex / chunkLength) * 100), 100));
    }
    return api.importFinish(importId, option);
  },
  export: async (code: string, exportCode: string, name: string, params: {}, option?: Option) => api.export(code, exportCode, name, params, option),
  getDownloadUrl: async (value: string, fileName: string, option?: Option) => {
    if (value.startsWith('s3://')) {
      const result = await s3Api.getDownloadUrl(fileName, value, option);
      if (!result.success) {
        return undefined;
      }
      return result.data;
    }
    return value;
  }
} as never;
