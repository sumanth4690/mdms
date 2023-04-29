import { Button, Typography, Grid, Box, TextField as MuiTextField } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styled from "styled-components/macro";
import { spacing } from "@mui/system";

const TextFieldSpacing = styled(MuiTextField)(spacing);
const TextField = styled(TextFieldSpacing)`width: 100%;background-color: #efefef8a`;
interface ICardProps {
	children: any
	icon?: any
	title: string
	subtitle?: string
}

const DetailsCard = ({ children, title, icon: Icon, subtitle }: ICardProps) => {
	console.log(subtitle)
	return (
		
		// <div className='bg-white shadow-sm rounded-lg border border-gray-200 border-opacity-30 w-full'>
		<Box>
			<Grid sx={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 3, mt:5 }}>
				{/* <div className='bg-gray-200 p-2 px-4 rounded-t-lg flex gap-2 items-center justify-between'> */}
				<Grid sx={{borderBottom:"1px solid #eee", p:2, }} >
					{/* <h3 className='text-gray-600 text-md'><b>{title}</b></h3> */}
					<Typography variant="h6" sx={{ color: "black", fontWeight:500 }} className="text-md"> {title} </Typography>
					<Typography sx={{ color: "black" }} className="text-sm subtitle_allocate"> {subtitle} </Typography>
					{/* <h3 className='text-gray-600 text-sm'>{subtitle}</h3> */}
					{/* </div> */}
				</Grid>

				<Grid sx={{ p: 3 }}> {children} </Grid>

			</Grid>
		</Box>
	)
}

DetailsCard.Image = ({ src }) => {
	return (
		<img src={`/images/${src}.png`} className='w-full h-full object-contain' />
	)
}

DetailsCard.Item = ({ label, value, isLarge = false }) => {
	return (
		<div className='space-y-1'>
			{/*<Typography variant="h6" className='text-sm text-gray-500 mb-1.5' > {label} </Typography>*/}
			{/* <p className='text-sm text-gray-500 mb-1.5'>{label}</p> */}
			{/* <h4>{value === null || value === undefined ? '--' : value}</h4> */}
			{/*<Typography> {value === null || value === undefined ? '--' : value} </Typography>*/}		
		
			<TextField						
				value={value === null || value === undefined ? '--' : value}
				label={label}
				id="standard-read-only-input"
				variant="outlined"	
				InputLabelProps={{
					shrink: true,
				}}
				InputProps={{
					readOnly: true,
				}}
			/>
		</div>		
	)
}

DetailsCard.Button = ({ label, onClick, startIcon }) => {
	return (
		<Button
			startIcon={startIcon}
			className='font-medium text-sm px-7'
			size='small'
			variant='outlined'
			color='secondary'
			onClick={onClick}
		>
			{label}
		</Button>
	)
}

export default DetailsCard
