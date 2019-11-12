import React, { useEffect, useState } from "react";
import { Typography, LinearProgress, makeStyles, createStyles, Theme, Table, TableRow, TableCell, TableHead, TableBody, Button } from "@material-ui/core";
import './App.css';

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
  const [lastRef, setLastRef] = useState(null);

  useEffect(() => {
    const getCerts = async () => {
      const checkCerts = await fetch('http://localhost:9999/checkCerts');
      checkCerts.json().then(function (data) {
        setCerts(data);
      })
      const lastRefreshed = await fetch('http://localhost:9999/lastRefreshed');
      lastRefreshed.json().then(function(data){
        setLastRef(data);
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
          <Typography variant="body1">This was last refreshed: "Server probably offline"<br />
            2 days, just so its not constantly doing refreshing the data. We may still be loading, or the server's offline.</Typography>
        </div>        
        <header><LinearProgress color="secondary" style={{width:'500px', height:'25px'}}/></header>
      </div>
    )
  }

  const getCertificates = (certificate) => {
    if (certificate.dayleft === '0') {
      return (
        <>
          <TableCell>{certificate.name}</TableCell>
          <TableCell>{certificate.port}</TableCell>
          <TableCell>{certificate.valid.toString()}</TableCell>
          <TableCell style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}>Unknown/No Certificate</TableCell>
          <TableCell>{certificate.dayleft}</TableCell>
        </>
      );
    } else
      if (certificate.dayleft < 30) {
        return (
          <>
            <TableCell>{certificate.name}</TableCell>
            <TableCell>{certificate.port}</TableCell>
            <TableCell>{certificate.valid.toString()}</TableCell>
            <TableCell style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
            <TableCell>{certificate.dayleft}</TableCell>
          </>
        );
      } else if (certificate.dayleft > 30 && certificate.dayleft < 60) {
        return (
          <>
            <TableCell>{certificate.name}</TableCell>
            <TableCell>{certificate.port}</TableCell>
            <TableCell>{certificate.valid.toString()}</TableCell>
            <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
            <TableCell>{certificate.dayleft}</TableCell>
          </>
        );
      } else if (certificate.dayleft > 60) {
        return (
          <>
            <TableCell>{certificate.name}</TableCell>
            <TableCell>{certificate.port}</TableCell>
            <TableCell>{certificate.valid.toString()}</TableCell>
            <TableCell style={{ backgroundColor: 'rgba(0, 255, 0, 0.3)' }}>{new Date(certificate.valid_to).toUTCString()}</TableCell>
            <TableCell>{certificate.dayleft}</TableCell>
          </>
        );
      }
  };

  return (
    <div className={classes.root}>
      <header></header>
      <div className={classes.all}>
        <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
        <Typography variant="body1">This was last refreshed: </Typography>
        <Typography variant="overline" style={{fontSize: '20px'}}>{lastRef}</Typography>
        <Typography variant="body1">We have loaded the data, if nothing is in the table please refresh!<br/>
          Not seeing a site you just entered? Give it a second! - Usually means the site is incorrect.</Typography>
      </div>
      <form action="http://localhost:9999/resetCerts">
        <Button type="submit" variant="outlined" color="secondary" style={{ width:'300px', position:'relative', marginLeft:'100px'}}>Reset Certicates</Button>
      </form>
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
              {getCertificates(allCerts)}
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  )

}
