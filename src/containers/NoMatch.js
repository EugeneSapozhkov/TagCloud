import React, {Component} from 'react'
import { Grid, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default class NoMatch extends Component {
	render() {
		return (
			<Grid xs={12} bsClass="container no-match-404">
				<Row>
					<Col xs={12}>
						<Alert bsStyle="danger">
							<strong>Ooops! 404 error!</strong>
						</Alert>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={3}>
						<Button>
							<Link to="/">Back to Home</Link>
						</Button>
					</Col>
				</Row>
			</Grid>
		)
	}
};