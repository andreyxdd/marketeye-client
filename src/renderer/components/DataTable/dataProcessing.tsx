import { IDataProps } from '../../../types';

const processData = (dataList: Array<IDataProps>, dataType: string) => {
  dataList.forEach((data: IDataProps, idx: number) => {
    Object.keys(data).forEach((key: string) => {
      if (
        [
          'by_one_day_avg_mf',
          'by_five_prec_open_close_change',
          'by_volume',
        ].includes(dataType) &&
        ['ema_3over9', 'ema_12over9', 'ema_12over26', 'ema_50over20'].includes(
          key
        )
      ) {
        data[key] = (data[key] as Array<string>).slice(0, 1);
      }
    });
    data.id = idx + 1;
  });
};

export default processData;
