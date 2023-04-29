import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Grid, MenuItem, TextField, Typography, Divider, Breadcrumbs } from '@mui/material'
import http, { access_token } from 'api/http'
// import ExcelImport from 'components/Excelmport'
import ExcelImport from 'components/Excelmport/meter_excel'
import { useNavigate, NavLink } from 'react-router-dom'

export const addMetersExcelImport = async (jsonData) => {
	return await http({
		url: '/items/meters',
		method: 'POST',
		params: {
			access_token,
		},
		data: jsonData,
	})
}

export default function AddMeters() {
	const navigate = useNavigate()
	return (
		<>

			{/* <Grid md={12} justifyContent="space-between" container >
				<Grid md={6}>
					<Typography variant="h3" gutterBottom sx={{ color: "black"}}>
						Add Meters
					</Typography>
				</Grid>
				<Grid md={6} sx={{textAlign:"right"}}>
					<Button
						size='small'
						variant='outlined'
						color='secondary'
						startIcon={<KeyboardBackspace />}
						onClick={() => navigate('/customers')}
					>
						Back
					</Button>
				</Grid>
			</Grid> */}

			<Grid md={6} mb={2} mt={2}>
				<Typography variant="h3" gutterBottom sx={{ color: "black" }} >
					Add Meters
				</Typography>
				<Breadcrumbs aria-label="breadcrumb" className='breadcrumbtext'>
					<NavLink to="/meters"> Meter </NavLink>
					<Typography variant="caption">Add Meters </Typography>
				</Breadcrumbs>
			</Grid>

			<Divider />

			<Grid md={12} sx={{ mt: 3 }}>
				<Grid sx={{ backgroundColor: "white", p: 5 }} className="rounded-xl">
					<ExcelImport postTo={addMetersExcelImport} redirectPath='/meters' />
				</Grid>
			</Grid>

			{/* <div className='space-y-7 pb-16 px-5 pt-5'>
				<div className='bg-white rounded-xl p-5'>
					
					<ExcelImport postTo={addMetersExcelImport} redirectPath='/meters' />
				</div>
			</div> */}
		</>
	)
}
