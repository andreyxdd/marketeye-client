import { ICriteria, IDataProps } from '../../../types';

const processData = (dataList: Array<IDataProps>, criterion: ICriteria) => {
  return dataList.map((data: IDataProps, idx: number) => {
    const updateData = { ...data, id: idx + 1 };
    if (['one_day_avg_mf', 'volume'].includes(criterion)) {
      updateData.ema_3over9 = data.ema_3over9.slice(0, 1);
      updateData.ema_12over9 = data.ema_12over9.slice(0, 1);
      updateData.ema_12over26 = data.ema_12over26.slice(0, 1);
      updateData.ema_50over20 = data.ema_50over20.slice(0, 1);
    }
    return updateData;
  });
};

export default processData;
