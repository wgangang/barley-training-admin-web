export default class MicroAppUtils {
  public static getApp() {
    return JSON.parse(sessionStorage.getItem('APP') || '{}');
  }

  public static getNetDiskPermissions() {
    return sessionStorage.getItem('NET_DISK_PERMISSION_' + (this.getApp()?.microCode || '')) === 'true';
  }

  public static getAppCode() {
    return this.getApp()?.microCode;
  }
}
