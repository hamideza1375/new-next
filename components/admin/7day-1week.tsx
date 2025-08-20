import { VictoryAxis, VictoryBar, VictoryGroup, VictoryLabel } from 'victory';

interface DataItem {
  createdAt: string;
  price: number;
}

interface SteamProps {
  data?: DataItem[];
}

export const Steam = ({ data = [] }: SteamProps) => {
  const fillColor = '#ff00ffaa';
  const textColor = '#f8f8f8';

  const chartTheme = {
    axis: {
      stroke: textColor,
      opacity: '0.3',
    },
    tickLabels: {
      fill: textColor,
      direction: 'ltr',
    },
    grid: {
      stroke: 'transparent',
    },
  };

  // دسته‌بندی داده‌ها بر اساس ماه
  const dataByMonth = data.reduce<Record<string, { createdAt: string; price: number }>>((acc, item) => {
    let d = new Date(item.createdAt).toLocaleDateString('fa');
    const createdAt = d.split('/')[1] + '/' + d.split('/')[2];
    if (!acc[createdAt]) {
      acc[createdAt] = { createdAt, price: 0 };
    }
    acc[createdAt].price += item.price;
    return acc;
  }, {});

  // تبدیل داده‌ها به فرمت مناسب برای Victory
  const formattedData = Object.values(dataByMonth).map((item) => ({
    createdAt: item.createdAt,
    price: item.price,
  }));

  return (
    <VictoryGroup
      theme={{
        axis: {
          style: {
            tickLabels: {
              fill: fillColor,
              fontSize: 11,
              padding: 6,
            },
            axisLabel: {
              fill: fillColor,
            },
          },
        },
      }}
    >
      <VictoryBar
        data={formattedData}
        x="createdAt"
        y="price"
        // labels=""
        style={{
          data: { fill: fillColor },
          labels: { padding: 4, fill: textColor, opacity: '0.8', fontSize: 13 },
        }}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: (event, { datum }) => {
                const { _y } = datum;
                return [
                  {
                    target: 'labels',
                    mutation: (props) => {
                      // return event.type === 'click' ? { text: _y}: { text: ''};
                      return props.text !== '' ? 'null' : { text: _y };
                    },
                  },
                ];
              },
            },
          },
        ]}
      />

      <VictoryAxis
        tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55} />}
        tickValues={formattedData.map((d) => d.createdAt)}
        // tickLabelProps={{ angle: 45 }}
        style={chartTheme}
      />

      <VictoryAxis dependentAxis /* label="درآمد (تومان)" */ style={chartTheme} />

      <VictoryLabel x={100} y={20} text="نمودار درآمد ماهیانه" style={[{ fill: textColor, opacity: 0.5 }]} />
      <VictoryLabel
        angle={-90}
        x={6}
        y={115}
        text="درامد (تومان)"
        style={[{ fill: textColor, opacity: 0.5, fontSize: 12 }]}
      />
    </VictoryGroup>
  );
};