import { Button, CircularProgress, MenuItem, TextField, Grid, Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { fetchPowerConsumptionInMonthAll, fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle } from 'api/services/dashboard'
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



const MonthlyAll = () => {
	const [state, setState] = useState<{ month: number; year: number }>({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
	})
		
	const { data, error, isLoading, mutate } = useMutation(
		'fetchPowerConsumptionInMonthAll', fetchPowerConsumptionInMonthAll
	)
	// console.log("aabhsdfsjd",data)

	const {
		data:resTime,
		isLoading: loading1,
		error: error1
	} = useQuery('fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle',fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle);

	// console.log("response date and time for power consumption history",resTime)


	useEffect(() => {
		mutate({ month: state.month, year: state?.year })
	}, [])

	const values1 = data?.series.map((item) =>
		((item/1000).toFixed(2))
	)
	// console.log("Values1 Vk",values1);
	

	var today = new Date();
	var dd = today.getDate();
	//console.log(dd);
	//const date1p=data?.data.source_timestamp_day;
	let i=0;
	var values = [];
	if(typeof values1 != 'undefined' ){
	 while(i < dd){
		values.push(values1[i]);
		i++;
	}}
//console.log(values);

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({ month: state.month, year: state?.year })
	}

	const Card = styled(MuiCard)(spacing);
	// const {
	// 	data: latestTime,
	// 	error: error4,
	// 	isLoading: loading4,
	//   } = useQuery('datetime', fetchLatestDateTimeForDataSync)
	// const date = latestTime?.data?.data[0].server_date_time
	// const addedDate = add(new Date(date), {
	//   hours: 5,
	//   minutes: 30,
	// })


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
					{/* <Typography variant="caption">
						<div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</div>
					</Typography> */}
				</Grid>

				<Grid md={4} sx={{ textAlign: "right", p: 2 }}>
					<form className='custom_form_M powerconsumtionchart' onSubmit={handleSubmit}>
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
					{/* <Typography variant="caption">
						<Grid className="prepaidtimeclass" pt={1} ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</Grid>
					</Typography> */}
					<Typography variant="caption">
						<Grid className="prepaidtimeclass" pt={1} ><AccessAlarmIcon className="alarmicon" />{''}{resTime}</Grid>
					</Typography>
				</Grid>
			</Grid>
			{!isLoading ? (
				<Chart
					height={500}
					type='line'
					options={{
						chart: { id: 'monthly-consumption' },
						xaxis: {
							categories: data?.category,
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
									fontSize: '12px',
								},
							},
						},
						markers: {
							size: 5,
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
							data: values1,
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

export default MonthlyAll

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
			fontSize: '12px',
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
