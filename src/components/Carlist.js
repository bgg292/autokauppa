import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcar from './Addcar';
import Editcar from './Editcar';

const useStyles = makeStyles(theme => ({
	close: {
		padding: theme.spacing(0.5),
	},
}));

export default function Carlist() {

	const classes = useStyles();
	const [cars, setCars] = useState([]);
	const [openDel, setOpenDel] = React.useState(false);
	const [openSave, setOpenSave] = React.useState(false);

	useEffect(() => fetchData(), []);

	const fetchData = () => {
		fetch('https://carstockrest.herokuapp.com/cars')
		.then(response => response.json())
		.then(data => setCars(data._embedded.cars))
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenDel(false);
		setOpenSave(false);
	};

	const deleteCar = (link) => {
		if (window.confirm('Are you sure?')) {
			fetch(link, {method: 'DELETE'})
			.then(res => fetchData())
			.catch(err => console.error(err));
			setOpenDel(true);
		}
	}

	const saveCar = (car) => {
		fetch('https://carstockrest.herokuapp.com/cars', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(car)
		})
		.then(res => fetchData())
		.catch(err => console.error(err));
		setOpenSave(true);
	}

	const updateCar = (car, link) => {
		fetch(link, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(car)
		})
		.then(res => fetchData())
		.catch(err => console.error(err));
		setOpenSave(true);
	}

	const columns = [
		{
			Header: 'Brand',
			accessor: 'brand'
		},
		{
			Header: 'Model',
			accessor: 'model'
		},
                {
                        Header: 'Color',
                        accessor: 'color'
                },
                {
                        Header: 'Fuel',
                        accessor: 'fuel'
                },
                {
                        Header: 'Year',
                        accessor: 'year'
                },
                {
                        Header: 'Price',
                        accessor: 'price'
                },
		{
			sortable: false,
			filterable: false,
			width: 100,
			Cell: row => <Editcar updateCar={updateCar} car={row.original} />
		},
		{
			sortable: false,
			filterable: false,
			width: 100,
			accessor: '_links.self.href',
			Cell: row => <Button size="small" color="secondary" onClick={() => deleteCar(row.value)}>Delete</Button>
		}
	]

	return (
		<div>
			<Addcar saveCar={saveCar} />
			<ReactTable defaultPageSize={10} filterable={true} data={cars} columns={columns} />
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={openDel}
				autoHideDuration={6000}
				onClose={handleClose}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">Car deleted</span>}
				action={[
					<IconButton
						key="close"
						aria-label="close"
						color="inherit"
						className={classes.close}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>,
				]}
			/>
                        <Snackbar
                                anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                }}
                                open={openSave}
                                autoHideDuration={6000}
                                onClose={handleClose}
                                ContentProps={{
                                        'aria-describedby': 'message-id',
                                }}
                                message={<span id="message-id">Car saved</span>}
                                action={[
                                        <IconButton
                                                key="close"
                                                aria-label="close"
                                                color="inherit"
                                                className={classes.close}
                                                onClick={handleClose}
                                        >
                                                <CloseIcon />
                                        </IconButton>,
                                ]}
                        />
		</div>
	);
}
