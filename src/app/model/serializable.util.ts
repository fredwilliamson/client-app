export class Serializable {
  assignFromObject<T>(_data: any, objectType: new () => T): T {
    return Object.assign(new objectType(), _data);
  }

  assignFromObjectList<T>(_dataList: any[], objectType: new () => T): T[] {
    const arrayList = new Array<T>();
    _dataList.forEach((data) => {
      arrayList.push(this.assignFromObject(data, objectType));
    });

    return arrayList;
  }
}
