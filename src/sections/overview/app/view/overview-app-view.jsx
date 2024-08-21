'use client';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { AppWidgetSummary } from '../app-widget-summary';

import useSWRInfinite from 'swr/infinite';
import { fetcher } from 'src/utils/axios';

import _ from 'lodash'
import { transformBill } from 'src/utils/transformer';
import { isToday, isYesterday } from 'date-fns';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const theme = useTheme();

  const getKey = (pageIndex, previousPageData) => {
    const BASE_API = `/api/v5/account/bills?instType=SPOT&type=2`
    const bills = previousPageData?.data || []

    if (pageIndex === 0) return BASE_API
    if (previousPageData && bills.length < 100) return null

    const earliestBillId = _.chain(bills)
                            .map('billId')
                            .map(_.toNumber)
                            .min()
                            .value()

    return `${BASE_API}&before=${earliestBillId}`
  }

  const { data: weeklyTradesData} = useSWRInfinite(getKey, fetcher, { initialSize: 10, persistSize: true });

  const trades = _.chain(weeklyTradesData || [])
                  .map('data')
                  .uniq()
                  .flatten()
                  .map(transformBill)
                  .value()
  const billChartSeries = _.chain(trades)
                            .countBy('tsDayOfWeek')
                            .thru((result) => _.map(DAYS_OF_WEEK, (day) => result[day] || 0))
                            .value()

  const tradesToday = _.filter(trades, (trade) => isToday(trade.ts))
  const tradesYesterday = _.filter(trades, (trade) => isYesterday(trade.ts))
  const percentIncrease = ((tradesToday.length - tradesYesterday.length) / tradesYesterday.length) * 100

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Trades Today"
            percent={percentIncrease}
            percentLabel={"from yesterday"}
            total={tradesToday.length}
            chart={{
              categories: DAYS_OF_WEEK,
              series: billChartSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
