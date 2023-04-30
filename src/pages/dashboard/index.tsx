import React from "react";
import {Speed} from '@mui/icons-material'
import {CircularProgress} from '@mui/material'

import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { spacing } from "@mui/system";

import {
	fetchMtd,
	fetchPowerOutageCount,
	fetchTamperEventCount,
	fetchTotalDeployedMeters,
	fetchTotalInstalledMeters,
	fetchTotalMeterCount,
	// fetchYtd,
} from 'api/services/dashboard'
import {
	fetchLatestDateTimeForDailyLoadSync,
	fetchLatestDateTimeForDataSyncForMeters,
	fetchPowerOutageAndTampersLatestSync,
	fetchSyncTimeForInactiveMeters,
} from 'api/services/time-labels'
import add from 'date-fns/add'
import format from 'date-fns/format'
import {useQueries, useMutation, useQuery} from 'react-query'
import {Link} from 'react-router-dom'
import PowerConsumptionPanel from './power-consumption'
// import MonthlyPowerConsumptionSingle from './power-consumption/MonthlySingle'
// import MonthlyPowerConsumptionThird from './power-consumption/MonthlyThird'
import MonthlySingle from './power-consumption/MonthlySingle'
import MonthlyThird from './power-consumption/MonthlyThird'
import MonthlyAll from './power-consumption/MonthlyAll'
import Yearly from './power-consumption/Yearly'
import ThirtyDaysActiveMeters from './ThirtyDaysActiveMeters'
import BarChart from "./BarChart"
import BarChartSingle from "./BarChartSingle"
import BarChartThird from "./BarChartThird"
// import BarChartAll from "./BarChartAll"
import Stats from "./Stats";
import {useState, useEffect} from 'react'
import DoughnutChart from "./DoughnutChart";
import DoughnutChartSingle from "./DoughnutChartSingle";
import DoughnutChartThird from "./DoughnutChartThird";
import DoughnutChartAll from "./DoughnutChartAll";
/*import WorldMap from "./WorldMap";*/
import WorldMapAll from "./WorldMapAll";
import WorldMapSingle from "./WorldMapSingle";
import WorldMapThird from "./WorldMapThird";
import {fetchAreas, fetchMapData, fetchSections} from 'api/services/gis'
import {
	fetchLatestTimeForPowerConsumptionSingle, 
	fetchLatestTimeForPowerConsumptionThird,
	fetchPowerConsumptionMonthSingle,
	fetchPowerConsumptionMonthThree,
} from 'api/services/dashboard'

import MeterDataSyncGraph from 'pages/hes-dashboard/data-sync'
import StackedBarApexes   from './stackChart'



const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const Dashboard = () => {
	const { t } = useTranslation();
	const [
		{data: totalDeployedMeters, error: error2, isLoading: loading2},
		{data: installedMeters, error: error3, isLoading: loading3},
		{data: totalMeters, error: error5, isLoading: loading5},
		// {data: powerOutageCount, error: error6, isLoading: loading6},
		// {data: mtd, error: error7, isLoading: loading7},
		// {data: ytd, error: error8, isLoading: loading8},
		// {data: tamperCount, error: error9, isLoading: loading9},
		{data: meterLatestSycTime, error: error10, isLoading: loading10},
		// {data: dailyLoadSyncTime, error: error11, isLoading: loading11},
		// {data: powerEventsAndTampers, error: error12, isLoading: loading12},
		// {data: inactiveSyncTime, error: error13, isLoading: loading13},			
	] = useQueries([
		{queryKey: 'totalDeployedMetrics', queryFn: fetchTotalDeployedMeters},
		{queryKey: 'installedMeters', queryFn: fetchTotalInstalledMeters},
		{queryKey: 'totalMeters', queryFn: fetchTotalMeterCount},
		// {queryKey: 'powerOutageCount', queryFn: fetchPowerOutageCount},
		// {queryKey: 'mtd', queryFn: fetchMtd},
		// {queryKey: 'ytd', queryFn: fetchYtd},
		// {queryKey: 'tamperCount', queryFn: fetchTamperEventCount},
		{
			queryKey: 'latestSyncTimeForMeters',
			queryFn: fetchLatestDateTimeForDataSyncForMeters,
		},
		// {
		// 	queryKey: 'latestSyncTimeForDailyLoad',
		// 	queryFn: fetchLatestDateTimeForDailyLoadSync,
		// },
		// {
		// 	queryKey: 'latestSyncTimeForPowerEventsAndTampers',
		// 	queryFn: fetchPowerOutageAndTampersLatestSync,
		// },
		// {
		// 	queryKey: 'syncTimeForInactiveMeters',
		// 	queryFn: fetchSyncTimeForInactiveMeters,
		// }
	])
	
	const [totalmeter, setTotalmeter] = useState<any>("");
	const [instalm, setInstalm] = useState<any>("");
	const [totalcom, setTotalcom] = useState<any>("");	
	const [installcom, setInstallcom] = useState(0);
	const [ tamperCount, setTamperCount ] = useState<any>('')

	const [powerconsingle, setPowerconsingle] = useState<any>(0);
	
	const [active, setActive] = useState(false);
	const [latestSingleTime, setLatestSingleTime] = useState('')
	const [latestThirdTime, setLatestThirdTime] = useState('')
	const [powerConsumtionSingleMonth, setPowerConsumtionSingleMonth] = useState<any>('')
	const [powerConsumtionThreeMonth, setPowerConsumtionThreeMonth] = useState<any>('')

	useEffect(()=>{
		getamperEventCount()
	},[])

	const getamperEventCount = async () => {
		const res = await fetchTamperEventCount()
		setTamperCount(res)
	}
	
	// const [count, setCount] = useState({
	// 	active: 0,
	// 	inActive: 0,
	// })

	// const {
	// 	data: areas,
	// 	error: areasError,
	// 	isLoading: areasLoading,
	// 	mutate: mutateAreas,
	// } = useMutation('areas', fetchAreas)

	// const {
	// 	data: sections,
	// 	isLoading: sectionsLoading,
	// 	error: sectionsError,
	// } = useQuery('sections', fetchSections)

	// const {
	// 	data: locations,
	// 	isLoading: mapDataLoading,
	// 	error: mapDataError,
	// 	mutate,
	// } = useMutation('mapData', fetchMapData, {
	// 	onSuccess: (locations) => {
	// 		setCount({
	// 			active: locations?.activeCount,
	// 			inActive: locations?.inactiveCount,
	// 		})
	// 	},
	// })
	
	// const [state, setState] = useState({
	// 	area: '',
	// 	section: '',
	// 	meterState: 'all',
	// })
	
	const [phase, setPhase] = useState<any>({
		phase: 'all',
	})
	
	//console.log('ARUNNEW DATA'+powerConsumptionMonthSingle.data.sum.energy_kwh_import);
	// const handleChange = (name, value) => {
	// 	setState((prev) => ({...prev, [name]: value}))
	// }

	// useEffect(() => {
	// 	mutate({})
	// }, [])

	
	useEffect(() => {
		getLatestSingleTime()		
	}, [])
	
	const getLatestSingleTime = async () => {
		const res = await fetchLatestTimeForPowerConsumptionSingle()
		setLatestSingleTime(res)		
	}
	localStorage.setItem('syncdatetime', latestSingleTime)
	
	// useEffect(() => {
	// 	getLatestThirdTime()		
	// }, [])
	
	// const getLatestThirdTime = async () => {
	// 	const res = await fetchLatestTimeForPowerConsumptionThird()
	// 	setLatestThirdTime(res)
	// }	
	
	

	/* Power consumtion single*/
	
	useEffect(() => {
		getPowerConsumtionSingleMonth()
	},[])
	
	const getPowerConsumtionSingleMonth = async () => {
		const res = await fetchPowerConsumptionMonthSingle()
		setPowerConsumtionSingleMonth(res)
	}
	
	/* Power consumption three */
	
	useEffect(() => {
		getPowerConsumtionThreeMonth()
	},[])
	
	const getPowerConsumtionThreeMonth = async () => {
		const res = await fetchPowerConsumptionMonthThree()
		setPowerConsumtionThreeMonth(res)
	}
	
	//console.log(powerConsumtionSingleMonth.data.data[0].sum.energy_kwh_import)
	
	const meterLatest = meterLatestSycTime?.data?.data[0].latest_sync_date;
	
	// const commundate = inactiveSyncTime?.data?.data[0].date_updated;
	const meterLatestSyc = add(new Date(meterLatest), {
		hours: 5,
		minutes: 30,
	})
	// console.log(meterLatestSyc,"dfskdfjksdfjkdsfj");
	
	// const constcommunicationdate = add(new Date(commundate), {
	// 	hours: 5,
	// 	minutes: 30,
	// })	
	let selectedVal = 'all';
	
	const handleUpdateKpData = (ev) => {
		
		setPhase({
			phase:ev.currentTarget.dataset.data_kp
		})
		
		let selectedVal = ev.currentTarget.dataset.data_kp;
		let listItems = document.querySelectorAll(".list-group-item");
		
		for (let i = 0; i < listItems.length; i++) {
			listItems[i].classList.remove("active-a");
		}
		
		ev.currentTarget.classList.add("active-a");
		
		if(selectedVal == '1p'){
			
			localStorage.setItem('syncdatetime', latestSingleTime)		
			
			var totalmeter = totalDeployedMeters?.data?.data[0]?.count.meter_serial_number || '-';
			var installmeter = installedMeters?.data?.data[0]?.count?.meter_serial_number ||'-';

			var totalcom = totalMeters?.data?.data[0]?.count?.meter_serial_number || '0';
			var installcom = installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number || '0';	
			
			var powerconsingle = ((powerConsumtionSingleMonth?.data?.data[0]?.sum.energy_kwh_import)/1000).toFixed(2) || '-';
			
		}else if(selectedVal == '3p'){
			
			localStorage.setItem('syncdatetime', latestThirdTime)
			
			var totalmeter = totalDeployedMeters?.data?.data[1]?.count.meter_serial_number || '-';
			var installmeter = installedMeters?.data?.data[1]?.count?.meter_serial_number ||'-';

			var totalcom = totalMeters?.data?.data[1]?.count?.meter_serial_number ||'0';
			var installcom = installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number || '0';	


			var powerconsingle = ((powerConsumtionThreeMonth?.data?.data[0]?.sum.energy_wh_import)/1000).toFixed(2) || '-';
			
			
		}else if(selectedVal == 'all'){	

			localStorage.setItem('syncdatetime', latestThirdTime)
			
			var totalmeter1p = totalDeployedMeters?.data?.data[0]?.count.meter_serial_number || '';
			var totalmeter3p = totalDeployedMeters?.data?.data[1]?.count.meter_serial_number || '';
			var totalmeter = totalmeter1p + totalmeter3p;

			var installmeter1p = installedMeters?.data?.data[0]?.count?.meter_serial_number ||'';
			var installmeter3p = installedMeters?.data?.data[1]?.count?.meter_serial_number ||'';
			var installmeter = installmeter1p + installmeter3p;

			var totalcom1p = totalMeters?.data?.data[0]?.count?.meter_serial_number || '';
			var totalcom3p = totalMeters?.data?.data[1]?.count?.meter_serial_number ||	'';
			var totalcom = totalcom1p + totalcom3p;
			// var totalcom = totalMeters?.data?.data[0]?.count?.meter_serial_number || totalMeters?.data?.data[1]?.count?.meter_serial_number
			// console.log("totalcom", totalcom);
			

			var installcom = installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number || '' + Number(installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number || '');	
			// var installcom1p = installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number || '';
			// var installcom3p = Number(installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number || '');
			// var installcom = installcom1p + Number(installcom3p);

			// console.log("All",Number(installcom1p) + Number(installcom3p))
			// console.log("1p",installcom1p,typeof(installcom1p))
			// console.log("3p",installcom,typeof(installcom))
			
			var powerconsingle1p = Number(((powerConsumtionSingleMonth?.data?.data[0]?.sum.energy_kwh_import)/1000).toFixed(2) || '');
			var powerconsingle3p = Number(((powerConsumtionThreeMonth?.data?.data[0]?.sum.energy_wh_import)/1000).toFixed(2) || '');
			var powerconsingle = (powerconsingle1p + powerconsingle3p).toFixed(2);
				
			// var totalmeter = totalDeployedMeters?.data?.data.reduce((acc, meter) => acc + +meter?.count?.meter_serial_number,0)||'-';			
			// var installmeter = installedMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0)||'-';

			// var installcom = installedMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0) - totalMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0) || '-'; //8
			// var totalcom = totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number || '-';	// 3		
		}
		setTotalcom(totalcom);
		setInstallcom(Number(installcom));
		setTotalmeter(totalmeter);
		// setInstalm(installmeter.trim()===''?'-':installmeter);
		setInstalm(installmeter);
		setPowerconsingle(powerconsingle);
	}
	
	const user = JSON.parse(localStorage.getItem('userDetails')) &&
	JSON.parse(localStorage.getItem('userDetails'))[0]
	
	const isLoading =
		loading2 ||
		loading3 ||
		loading5 ||
		// loading6 ||
		// loading7 ||
		// loading8 ||
		// loading9 ||
		loading10
		// loading11 ||
		// loading12 ||
		// loading13
	if (isLoading)
		return (
			<div className='flex items-center justify-center w-full h-screen'>
				<CircularProgress />
			</div>
		)
	if (error2 || error3 ){ 
		return <p>Error</p>
	}
	
	const totalcommunitatio = (totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number) || '0';
	// const nottotalcommunication = (installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number + Number(installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number) || '-');
		
	// console.log("nottotalcommunication",nottotalcommunication)
	// const totalamount = ((totalcom)?totalcom:(totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number));
	// const amount=((instalm)?instalm:(installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number));
	
	const totalamount = (totalmeter) ? totalmeter : (totalDeployedMeters?.data?.data[0]?.count.meter_serial_number + totalDeployedMeters?.data?.data[1]?.count.meter_serial_number);
	const amount = (instalm) ? instalm : (installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number);
	const percent = ((amount / totalamount) * 100).toFixed(2);
	
	let chk_percent = '';
	if(percent === 'NaN'){
		chk_percent = "100.00";
	}else{
		chk_percent = percent;
	}
	
	// const com_amount =((installcom)?installcom:nottotalcommunication) || '-';
	const com_amount=((totalcom)?totalcom:totalcommunitatio) || '0';

	// console.log("totalcom", totalcom);
	// console.log("com_amount", com_amount);
	// console.log("totalcommunitatio", totalcommunitatio);
	
	// console.log("com_amount----------->",com_amount)
	const com_totalamount=(amount - Number(com_amount)) || '0'; //'-'
	// const com_percent = ((Number(com_totalamount) / Number(com_amount)) * 100 ).toFixed(2);

	// console.log("com_totalamount", com_totalamount);
	// console.log("(amount - Number(com_amount))", (amount - Number(com_amount)));

	const com_data = (Number(com_amount) - Number(com_totalamount));
	const com_percent = ((com_data / com_amount) * 100).toFixed(2);

	// console.log("com_data", com_data);

	let percent_chk = '';
	if(com_percent === 'NaN' || com_percent === '-Infinity'){
		percent_chk = "100.00";
	}else{
		percent_chk = com_percent;
	}
	// console.log("333333333333333333",percent_chk)
	// console.log("totalcom", totalcom);


	return (	
	
		<React.Fragment>		
			<Grid justifyContent="space-between" container spacing={6} className="anshu_siddharth1">
				<Grid item xs={12} lg={9}>
				  <Typography variant="h3" gutterBottom>
					Dashboard
				  </Typography>
				  <Typography variant="subtitle1">
					{t("Welcome back")}, {user?.first_name} {user?.last_name}! {t("We've missed you")}.{" "}
					<span role="img" aria-label="Waving Hand Sign">
					  👋
					</span>
				  </Typography>
					
				</Grid>
				<Grid item xs={12} lg={3} className="text-right phasebutton">
					<div className="btn-group btn-group-sm p-formselect activebutton" role="group" aria-label="Small button group">
						<button type="button" className="list-group-item active-a" data-data_kp="all" onClick={handleUpdateKpData}>All</button>
						<button type="button" className="list-group-item" data-data_kp="1p" onClick={handleUpdateKpData}>1P</button>
						<button type="button" className="list-group-item" data-data_kp="3p" onClick={handleUpdateKpData}>3P</button>
					</div>
				</Grid>
			</Grid>
			<Divider my={3} />			
			<Grid container spacing={6}>
				<Grid item xs={12} lg={7}>
				  <Grid container spacing={3} className="icons_for_card">

					{/* {"com_totalamount :- " + com_totalamount}
					<br />
					{"h1 :- " + ((totalcom)?totalcom:totalcommunitatio)}
					<br />
					{"totalcom : -" + totalcom}
					<br />
					{"totalcommunitatio : -" + totalcommunitatio} */}

					<Grid item xs={12} sm={12} md={6} >
					  <Stats 
						title="TOTAL/INSTALLED METERS"
						// totalamount = {(totalcom)?totalcom:(totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number) || '-'}
						// amount={(instalm)?instalm:(installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number) ||'-'} 
						amount={(totalmeter) ? totalmeter : (totalDeployedMeters?.data?.data[0]?.count.meter_serial_number + totalDeployedMeters?.data?.data[1]?.count.meter_serial_number) || totalDeployedMeters?.data?.data[0]?.count.meter_serial_number}

						totalamount={(instalm) ? instalm : (installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number) || installedMeters?.data?.data[0]?.count?.meter_serial_number}
						chip=""
						// statstime = {meterLatest && localStorage.getItem('syncdatetime')}
						statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
						// percentagetext="+14%"
						percentagetext = {"+" + chk_percent + "%"}
						percentagecolor={green[500]}
						// illustration="/static/img/illustrations/working.png"
						illustration="/static/img/illustrations/ibot/1.installed-meter.png"
					  />
					</Grid>
					<Grid item xs={12} sm={12} md={6}>
					  <Stats
						title="POWER CONSUMPTION MTD"
						totalamount =""
						amount={(powerconsingle)?powerconsingle:((((Number(powerConsumtionSingleMonth?.data?.data[0]?.sum.energy_kwh_import)/1000) + Number((powerConsumtionThreeMonth?.data?.data[0]?.sum.energy_wh_import)/1000)).toFixed(2) || '-')) + " kwh"}
						chip=""
						// statstime ={meterLatest && localStorage.getItem('syncdatetime')}
						statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
						percentagetext="NA"
						percentagecolor={green[500]}
						illustration="/static/img/illustrations/ibot/icons8-chart-64.png"
					  />
					</Grid>
					<Grid item xs={12} sm={12} md={6}>
						<Link to='/meters/data?phase=single-phase' className="label_data_wrap">
						  <Stats
							title="COMM/NON-COMM METERS"
							// totalamount ={(installcom)?installcom:nottotalcommunication}
							totalamount = {com_totalamount === "0" ? 0 : com_totalamount}
							amount={(totalcom)?totalcom:totalcommunitatio === "0" || totalcommunitatio}
							chip=""
							// statstime ={meterLatest && localStorage.getItem('syncdatetime')}
							statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
							// percentagetext="-18%"
							percentagetext={"+" + percent_chk + "%"}
							percentagecolor={green[500]}
							illustration="/static/img/illustrations/working-2.png"
						  />
						</Link>
					</Grid>
					<Grid item xs={12} sm={12} md={6}>
					  <Link className='cursor-pointer block h-full' to='/tampers'>
					  <Stats
						title="ALERTS AND TAMPERS"
						totalamount =""
						amount={tamperCount}
						chip=""
						// statstime ={meterLatest && localStorage.getItem('syncdatetime')}
						statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
						percentagetext="NA"
						percentagecolor={green[500]}
						illustration="/static/img/illustrations/ibot/4.opentampers.png"
					  />
					  </Link>
					</Grid>
				  </Grid>
				</Grid>
				<Grid item xs={12} lg={5} className="docnutsection">
					{(phase.phase=='1p')?<DoughnutChartSingle />:(phase.phase=='3p')?<DoughnutChartThird />:<DoughnutChartAll />}
				</Grid>
			</Grid>
			
			<Grid justifyContent="space-between" container mt={6}>
				
				<Grid item xs={12} lg={12} spacing={6}>
					{(phase.phase=='1p')?<BarChartSingle />:(phase.phase=='3p')?<BarChartThird />:<StackedBarApexes />}
				</Grid>
				
				<Grid item xs={12} lg={12} spacing={6}>
					{/* <WorldMap locations={locations?.data} /> */}
					{(phase.phase=='1p')?<WorldMapSingle />:(phase.phase=='3p')?<WorldMapThird />:<WorldMapAll />}
				</Grid>
				
				<Grid item xs={12} lg={12} spacing={6}>
					{/* {(phase.phase=='1p')?<MonthlyPowerConsumptionSingle />:(phase.phase=='3p')?<MonthlyPowerConsumptionThird />:<MonthlyPowerConsumptionSingle />} */}
					{(phase.phase=='1p')?<MonthlySingle />:(phase.phase=='3p')?<MonthlyThird />:<MonthlyAll />}
				</Grid>
				
				<Grid item xs={12} lg={12} spacing={6}>
					<PowerConsumptionPanel phase={phase} />
				</Grid>
				
			</Grid>
		</React.Fragment>
		
	)
}

export default Dashboard
Dashboard.title = 'Dashboard'

interface ICardProps {
	label: string
	value: any
	icon: any
	children?: any
	latestTime?: any
}
const Chip = ({label}) => {
	return (
		<div className='border border-gray-400 rounded-lg px-3 py-1'>{label}</div>
	)
}

export const MetricsCard = ({
	label,
	value,
	icon: Icon,
	latestTime,
	children,
}: ICardProps) => {
	const date =
		latestTime?.data?.data[0].latest_sync_date ||
		latestTime?.data?.data[0].source_timestamp ||
		latestTime?.data?.data[0].server_timestamp ||
		latestTime?.data?.data[0].server_date_time ||
		latestTime?.data?.data[0].date_updated

	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})

	return (
		<div className='bg-white rounded-xl py-2 pl-8 pr-4 flex flex-col h-full'>
			<div className='flex-grow'>
				<div className='flex justify-between'>
					<p className='text-gray-400 text-[11px] font-bold uppercase'>
						{label}
					</p>
					<Icon />
				</div>
				<p className='text-xl font-bold'>{value}</p>
				<div className='flex justify-end mt-2 text-[12px]'>{children}</div>
			</div>
			<div className='flex items-center gap-2 justify-end mt-4 text-xs'>
				<p className='text-gray-500'>Latest updated time :</p>
				<p>{date && format(addedDate, 'dd/MM/yyyy HH:mm:ss')}</p>
			</div>
		</div>
	)
}

/* <MetricsCard
						label='Total Power Outage in hours'
						latestTime={powerEventsAndTampers}
						value={`${(
							powerOutageCount?.data?.data[0]?.count?.outage_duration / 60
						).toFixed(2)} Hours`}
						icon={Speed}
					></MetricsCard> */
