import { useEffect, useState } from 'react';
import { VictoryAxis, VictoryBar, VictoryGroup, VictoryLabel, VictoryTooltip as _VictoryTooltip } from 'victory';

interface DataItem {
  date: string;
  price: number;
}

interface FormattedDataItem {
  date: string;
  price: number;
  _y?: number;
}

export const VictoryTooltip = ({ data = [] }: { data?: DataItem[] }) => {
  const [formattedData, setFormattedData] = useState<FormattedDataItem[]>([]);

  const fillColor = '#ff5e00';
  const textColor = '#555';

  const chartTheme = {
    axis: {
      stroke: textColor,
      opacity: '0.3'
    },
    tickLabels: {
      fill: textColor,
      direction: 'ltr',
    },
    grid: {
      stroke: 'transparent'
    }
  };

  useEffect(() => {
    // دسته‌بندی داده‌ها بر اساس ماه
    const dataByMonth = data.reduce<Record<string, { date: string; price: number }>>((acc, item) => {
      let d = new Date(item.date).toLocaleDateString('fa');
      const date = d.split('/')[1] + '/' + d.split('/')[2];
      if (!acc[date]) {
        acc[date] = { date, price: 0 };
      }
      acc[date].price += item.price;
      return acc;
    }, {});

    // تبدیل داده‌ها به فرمت مناسب برای Victory
    const formatted = Object.values(dataByMonth).map(item => ({
      date: item.date,
      price: item.price
    }));

    if (formatted.length > 0) {
      setFormattedData(formatted);
    }
  }, [data]);

  return (
    <VictoryGroup
      theme={{
        axis: {
          style: {
            tickLabels: {
              fill: fillColor,
              fontSize: 10.5,
            },
            axisLabel: {
              fill: fillColor
            }
          }
        }
      }}
    >
      <VictoryBar
        data={formattedData}
        x="date"
        y="price"
        style={{
          data: { fill: fillColor, opacity: '0.4' },
          labels: { padding: 4, fill: textColor, opacity: '0.8', fontSize: 13 }
        }}
        labels={({ datum }) => Number(datum._y).toLocaleString()}
        labelComponent={
          <_VictoryTooltip
            renderInPortal
            dy={-20}
            style={{
              fill: '#000',
              padding: 8,
              fontSize: 12
            }}
          />
        }
      />

      <VictoryAxis
        tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55} />}
        tickValues={formattedData.map(d => d.date)}
        // tickLabelProps={{ angle: 45 }}
        style={chartTheme}
      />

      <VictoryAxis dependentAxis style={chartTheme} />

      <VictoryLabel 
        x={100} 
        y={20} 
        text="نمودار درآمد ماهانه" 
        style={[{ fill: textColor, opacity: 0.5 }]} 
      />
    </VictoryGroup>
  );
};