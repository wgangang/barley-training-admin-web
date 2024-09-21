import Fetch from 'beer-network/api';

class CommonApi extends Fetch {
  async getAppList<T>() {
    return this.get<T>('/report/app/getList');
  }

  async getUserMenus(app: string | undefined) {
    const result = await this.get<any>('/report/menus/getList', { app });
    if (!result.success) {
      return result;
    }
    const menus = (result.data as [] || []).filter((item: { parentId: string }) => {
      return item.parentId === '0';
    });
    return {
      ...result,
      data: menus.map((menu: any) => {
        return {
          ...menu,
          child: (result.data as [] || []).filter((item: any) => {
            return (item as { parentId: string }).parentId === menu.id;
          })
            .map((menu: any) => {
              return {
                ...menu,
                child: (result.data as [] || []).filter((item: any) => {
                  return (item as { parentId: string }).parentId === menu.id;
                })
              };
            })
        };
      })
    };
  }

  async setPassword<T>(password: string) {
    return this.postBody<T>('/usercenter/sysUser/setPassword', {
      password,
      companyId: 0,
      userId: 0
    });
  }

  async getSessionInfo<T>() {
    return this.get<T>('/auth/get');
  }
}

const api = new CommonApi(process.env.REQUEST_BASE_URL || '');
export default api;
