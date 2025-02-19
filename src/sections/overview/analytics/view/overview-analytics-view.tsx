'use client';

// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import {
  _analyticOrderTimeline,
  _analyticPosts,
  _analyticTasks,
  _analyticTraffic,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getListCustomer } from 'src/api/customer';
import { getListOrder } from 'src/api/order';
import { IQueryAnalytics } from 'src/types/analytics';
import { IDataCustomer } from 'src/types/customer';
import { getDateRange } from 'src/utils/format-time';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsNews from '../analytics-news';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsToolbar from '../analytics-toolbar';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  // const [analytics, setAnalytics] = useState<IAnalyTicsDto>({});
  const [state, setState] = useState<{
    query?: IQueryAnalytics;
    analytics?: any;
    customer?: IDataCustomer;
  }>({
    query: {
      from_date: format(new Date(), 'yyyy-MM-dd'),
      to_date: format(new Date(), 'yyyy-MM-dd'),
      period: '0-days',
    },
    analytics: {},
    customer: undefined,
  });

  const handleGetAnalytics = async (query: IQueryAnalytics) => {
    const { start, end } = getDateRange(query?.period as string);
    setState({ ...state, query: { ...state.query, from_date: start, to_date: end } });
  };

  const handleGetOrder = async (query: IQueryAnalytics) => {
    const res = await getListOrder({
      from_date: query?.from_date,
      to_date: query?.to_date,
    });
    setState({
      ...state,
      analytics: res,
      query: {
        ...state.query,
        from_date: query.from_date,
        to_date: query.to_date,
        period: query.period,
      },
    });
  };

  const handleGetCustomer = async (query: IQueryAnalytics) => {
    const res = await getListCustomer({
      from_date: query?.from_date,
      to_date: query?.to_date,
    });
    setState({
      ...state,
      customer: res,
      query: {
        ...state.query,
        from_date: query.from_date,
        to_date: query.to_date,
        period: query.period,
      },
    });
  };

  const init = async (query: IQueryAnalytics) => {
    handleGetAnalytics(query);
    handleGetOrder(query);
    handleGetCustomer(query);
  };

  const getRevenue = () => {
    const totalAmountSum = state.analytics.data?.reduce(
      (total: number, order: any) => total + order.totalAmount,
      0
    );
    return totalAmountSum;
  };

  const getProfit = () => {
    const totalProfit = state.analytics.data?.reduce((profitSum: number, order: any) => {
      const totalCost = order.items.reduce((sum: number, item: any) => sum + item.price, 0);
      const profit = order.totalAmount - totalCost;

      return profitSum + profit;
    }, 0);

    return totalProfit;
  };

  console.log(state);

  useEffect(() => {
    init(state.query as IQueryAnalytics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography> */}
      <AnalyticsToolbar
        query={state.query as IQueryAnalytics}
        changeQuery={(value) => {
          handleGetOrder(value);
          handleGetCustomer(value);
        }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Đơn hàng"
            total={state.analytics.totalCount || 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Doanh thu"
            total={getRevenue() || 0}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Lợi nhuận"
            total={getProfit() || 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Khách hàng mới"
            total={state.customer?.totalCount || 0}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid>
      </Grid>
    </Container>
  );
}
