'use client';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { AppWidgetSummary } from '../app-widget-summary';

import useSWR from 'swr';
import { fetcher } from 'src/utils/axios';

import _ from 'lodash'
import { transformBill } from 'src/utils/transformer';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const theme = useTheme();

  const { data: billsData, error, isLoading } = useSWR('/api/v5/account/bills?instType=SPOT&type=2', fetcher);
  const bills = billsData?.data ? _.map(billsData.data, transformBill) : [];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const billChartSeries = _.map(daysOfWeek, (day) => _.filter(bills, ['tsDayOfWeek', day]).length)

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Weekly Trades"
            percent={2.6}
            total={bills.length}
            chart={{
              categories: daysOfWeek,
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
