import React, { useEffect, useState } from "react";
import { Typography, LinearProgress, makeStyles, createStyles, Theme, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";
import './App.css';
import classes from "*.module.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    all: {
      flexGrow: 1,
      overflowY: 'hidden',
      userSelect: 'none',
      padding: '10px 10px 10px 10px',
      width: '500px'
    },
    Table: {
      userSelect: 'none',
      width: '500px'
    }
  }));

export function App() {
  const classes = useStyles(1);
  const [certs, setCerts] = useState(null);

  useEffect(() => {
    const getCerts = async () => {
      const checkCerts = await fetch('http://localhost:9999/checkCerts');
      checkCerts.json().then(function (data) {
        setCerts(data);
      })
    };
    getCerts();
  }, []);

  if (certs === null) {
    return (
      <div className={classes.root}>
        <header><LinearProgress color="secondary" /></header>
        <div className={classes.all}>
          <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
          <Typography variant="body1">There is logic to check to see if it has been refreshed in the last<br />
            2 days, just so its not constantly doing refreshing the data. IF there is a bar at the top we're still loading.</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <header></header>
      <div className={classes.all}>
        <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
        <Typography variant="body1">There is logic to check to see if it has been refreshed in the last<br />
          2 days, just so its not constantly doing refreshing the data. IF there is a bar at the top we're still loading.</Typography>
      </div>

      <Table className={classes.Table}>
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>PORT</TableCell>
            <TableCell>VALID</TableCell>
            <TableCell>VALID TO</TableCell>
            <TableCell>DAYS REMAINING</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {certs.map((allCerts, id: number) => (
            <TableRow key={id}>
              <TableCell>{allCerts.name}</TableCell>
              <TableCell>{allCerts.port}</TableCell>
              <TableCell>{allCerts.valid.toString()}</TableCell>
              <TableCell>{new Date(allCerts.valid_to).toUTCString()}</TableCell>
              <TableCell>{allCerts.dayleft}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  )

}
