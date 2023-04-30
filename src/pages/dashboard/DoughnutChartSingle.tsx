import React from "react";
import styled, { withTheme } from "styled-components/macro";
import Chart from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {CircularProgress} from '@mui/material'
import { Pageview, Search } from '@mui/icons-material';
import {
	fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle,
	fetchPowerConsumptionByYearSingle,
} from 'api/services/dashboard'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { getListOfLast10Years } from 'utils'

import { green, red, orange } from "@mui/material/colors";
import {
	Card as MuiCard,
	CardContent as MuiCardContent,
	CardHeader,
	IconButton,
	Table,
	TableBody,
	TableCell as MuiTableCell,
	TableHead,
	TableRow as MuiTableRow,
	Typography,
	MenuItem,
	TextField,
	Button,
	Grid
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)`
  position: relative;
  background: rgba(55,111,208,0.125);
  padding-right:10px;
	padding-bottom: 7px;  
`;

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: 24px;
  }
`;

const ChartWrapper = styled.div`
  height: 180px;
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;

const TableRow = styled(MuiTableRow)`
  height: 42px;

  &:last-child th,
  &:last-child td {
    border-bottom: 0;
  }
`;

const TableCell = styled(MuiTableCell)`
  padding-top: 0;
  padding-bottom: 0;
`;

const GreenText = styled.span`
  color: ${() => green[400]};
  font-weight: 400;
`;

const RedText = styled.span`
  color: ${() => red[400]};
  font-weight: 400;
`;

const DoughnutChartSingle = ({ theme }) => {
	const [state, setState] = useState<{ year: number | string }>({
		year: new Date().getFullYear(),
	})
	// const [latestTime, setLatestTime] = useState('')
	const {
		data: res,
		isLoading,
		mutate,
	} = useMutation('powerConsumptionTillEndOfYear', fetchPowerConsumptionByYearSingle)

	// useEffect(() => {
	// 	getLatestTime()
	// 	mutate({
	// 		year: state.year,
	// 	})
	// }, [])

	// const getLatestTime = async () => {
	// 	const res = await fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle()
	// 	setLatestTime(res)
	// }

	const {
		data: resTime,
		error: error1,
		isLoading: loading1
	} = useQuery('fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle', fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle)


	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({ year: state.year })
	}

	const data = res?.data?.data
	//console.log("anshusingh",data)

	const values = data?.map((item) =>
		(item.sum.energy_kwh_import / 1000).toFixed(2)
	)
	
	let newsum = 0;
	newsum = (data?.reduce((newsum, currentItem) => newsum = newsum + parseInt((currentItem.sum.energy_kwh_import / 1000).toFixed(2)), 0));

	let allMonth = ["January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let newLabels = ["January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	if (data) {
		newLabels = data?.map((item) =>
			allMonth[item?.source_timestamp_month - 1])
	}
	
	//console.log(newLabels);
	const donutdata = {
		labels: newLabels,
		datasets: [
			{
				data: values,
				backgroundColor: ['#3b7ddd', '#fcb92c', '#dee2e6', '#dc3545', '#dd783b', '#6e3bdd', '#3bc6dd', '#dd703b', '#0c335b', '#0c5b11', '#5b2a0c', '#52708e']
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		cutout: "85%",
	};
	if (isLoading)
	return (
		<Card mb={8}>
			<CardContent><CircularProgress /></CardContent>
		</Card>
	)
	return (
		<Card mb={8}>
			<Grid item className="donutleft">
				<CardHeader
					title="MONTHWISE CONSUMPTION (kwh)"
					sx={{ color: "#376fd0" }}
				/>
			</Grid>
			<Grid item className="donutright" mt={1}>
				<form className='flex gap-2 text-right donut_filter' onSubmit={handleSubmit}>
					<TextField
						select
						size='small'
						variant='outlined'
						value={state.year}
						onChange={(e: any) => setState({ year: e.target.value })}
					>
						{getListOfLast10Years().map((item) => (
							<MenuItem value={item}>{item}</MenuItem>
						))}
					</TextField>
					<Button
						type='submit'
						variant='contained'
						size='small'
						className="filterbuttondash"
					>
						<Search />
					</Button>
				</form>
			</Grid>


			<CardContent>
				<ChartWrapper>
					<DoughnutInner>
						<Typography variant="h6">TOTAL USAGE</Typography>
						<Typography variant="caption">{newsum} kWh</Typography>
					</DoughnutInner>
					<Chart type="doughnut" data={donutdata} options={options} />
				</ChartWrapper>
			</CardContent>
			{/* <Typography variant="caption"><div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</div></Typography> */}
			<Typography variant="caption"><div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{resTime}</div></Typography>
		</Card>
	);
};

export default withTheme(DoughnutChartSingle);
