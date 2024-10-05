export class Async {
  private isRun = false;

  async run<T>(func: () => Promise<T>): Promise<T | undefined> {
    try {
      if (this.isRun) {
        return undefined;
      }
      this.isRun = true;
      return await func();
    } finally {
      this.isRun = false;
    }
  }
}

export class Promises {
  public static async result(promise: Promise<any>): Promise<boolean> {
    return new Promise(resolve => {
      promise?.catch(() => resolve(false))
        .then(() => resolve(true));
    });
  }
}

export class NumberUtils {
  public static isNumeric(value: any) {
    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return !Number.isNaN(Number(value)) && !Number.isNaN(Number.parseFloat(value));
    }
    return false;
  }

  public static ifGeZeroNumeric(value: any, defaultValue?: any): any {
    return this.isNumeric(value) && Number(value) > 0 ? value : defaultValue;
  }

  public static number(value: any) {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    return Number(value)
      .toFixed(2);
  }

  public static format(value: number) {
    return (Math.floor(value * 100) / 100).toFixed(2);
  }
}

export class CascadeUtils {
  public static recursionFind(dataList: any[], parentId: string): string[] {
    if (parentId === '0') {
      return [];
    }
    if (dataList === undefined || dataList.length <= 0) {
      return [];
    }
    for (const item of dataList) {
      if (item.children === undefined || item.children.length <= 0) {
        // 如果没有子集, 能匹配则匹配 不能则跳过循环
        if (item.value === parentId) {
          return [item.value];
        }
        continue;
      } else if (item.value === parentId) {
        return [item.value];
      }
      const result = this.recursionFind(item.children, parentId);
      if (result.length <= 0) {
        continue;
      }
      return [item.value, ...result];
    }
    return [];
  }
}

export class ArrayUtils {
  static flat(array?: any[], index?: number) {
    const value = array?.[index || 0];
    return (value === undefined || value === null) ? undefined : value;
  }

  static toArray(value?: string | number) {
    if (value === undefined || value === null) {
      return [];
    }
    return [value];
  }
}
