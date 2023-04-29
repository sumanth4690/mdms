import { Button, CircularProgress, MenuItem, TextField, Grid, Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { fetchPowerConsumptionInMonth } from 'api/services/dashboard'
import ChartWrapper from 'components/ChartWrapper'
import { add } from 'date-fns'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useMutation } from 'react-query'
import { getListOfLast10Years, getListOfMonths } from 'utils'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {
	Card as MuiCard,
	CardContent as MuiCardContent,
	CardHeader,
	IconButton,
} from "@mui/material";

import { fetchLatestDateTimeForDataSync } from 'api/services/time-labels'
import { useQuery } from 'react-query'

import { spacing } from "@mui/system";
import styled, { withTheme } from "styled-components/macro";

const Monthly = () => {
	const [state, setState] = useState<{ month: number; year: number }>({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
	})
		
	const { data, error, isLoading, mutate } = useMutation(
		'monthlyPowerConsumption', fetchPowerConsumptionInMonth
	)
	// console.log("aabhsdfsjd",data)

	useEffect(() => {
		mutate({ month: state.month, year: state?.year })
	}, [])

	const values = data?.data?.map((item) =>
		(item.sum.energy_wh_import / 1000).toFixed(2)
	)
	const xaxis = data?.data?.map((item) =>
		format(new Date(item.date), 'yyyy-MM-dd')
	)
   // console.log(xaxis);
	//console.log(values);
	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({ month: state.month, year: state?.year })
	}

	const Card = styled(MuiCard)(spacing);
	const {
		data: latestTime,
		error: error4,
		isLoading: loading4,
	  } = useQuery('datetime', fetchLatestDateTimeForDataSync)
	const date = latestTime?.data?.data[0].server_date_time
	const addedDate = add(new Date(date), {
	  hours: 5,
	  minutes: 30,
	})

	const CardContent = styled(MuiCardContent)`
	  &:last-child {
		padding-top: 0;
		padding-bottom: 24px;
	  }
	`;

	return (
		<Card mb={6}>
			<Grid md={12} container>
				<Grid md={6} >
					<CardHeader
						title="Power consumption history - daywise in kWh"
						sx={{ fontSize: 14 }}
					/>
				</Grid>

				<Grid md={2} p={2}>
					<Typography variant="caption">
						<div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</div>
					</Typography>
				</Grid>

				<Grid md={4} sx={{ textAlign: "right", p: 2 }}>
					<form className=' custom_form_M powerconsumtionchart' onSubmit={handleSubmit}>
						<TextField
							select
							size='small'
							variant='outlined'
							value={state.month}
							onChange={(e: any) => setState({ ...state, month: e.target.value })}
							style={{ marginRight: '10px' }}
						>
							{getListOfMonths(state?.year).map((item) => (
								<MenuItem value={item.value}>{item.name}</MenuItem>
							))}
						</TextField>
						<TextField
							select
							size='small'
							variant='outlined'
							value={state.year}
							onChange={(e: any) => setState({ ...state, year: e.target.value })}
							style={{ marginRight: '10px' }}
						>
							{getListOfLast10Years().map((item) => (
								<MenuItem value={item}>{item}</MenuItem>
							))}
						</TextField>
						<Button
							type='submit'
							color='primary'
							variant='contained'
							size='small'
						>
							Submit
						</Button>
					</form>
				</Grid>
			</Grid>
			{!isLoading ? (
				<Chart
					height={500}
					type='line'
					options={{
						chart: { id: 'monthly-consumption' },
						xaxis: {
							categories: xaxis,
							title: { text: 'Month' },
							labels: {
								show: true,
								rotate: -45,
								rotateAlways: false,
								style: {
									fontSize: '12px',
								},
							},
						},
						yaxis: {
							title: {
								text: 'kWh'
							},
							labels: {
								style: {
									fontSize: '8px',
								},
							},
						},
						markers: {
							size: 1,
						},
						dataLabels: {
							formatter: function (val) {
								return val + 'kWh'
							},
						},
						...chartOptions,
					}}
					series={[
						{
							name: 'KWh',
							data: values,
						},
					]}
				/>
			) : (
				<div style={{ height: '500px' }}>
					<CircularProgress />
				</div>
			)}
		</Card>
	)
}

export default Monthly

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	dataLabels: {
		enabled: true,
		// offsetY: -20,
		// offsetY:0,
		style: {
			colors: ['#2297e5'],
			fontSize: '8px',
		},
	},
	chart: {
		toolbar: {
			show: false
		},
	},
	plotOptions: {
		bar: {
			dataLabels: {
				position: 'top',
			},
		},
	},
}
