import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, makeStyles, createStyles, Theme, Button } from "@material-ui/core";
import './App.css';
import { RenderTable } from "./components/Table/RenderTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    all: {
      flexGrow: 1,
      overflowY: 'hidden',
      userSelect: 'none',
      padding: '10px 10px 10px 10px',
      width: '500px'
    },
    header: {
      height: '75px',
      padding: '7px 7px 7px 7px',
      marginLeft: '500px',
      width: '65vw',
      backgroundColor: 'rgba(0,0,0,0)',
      boxShadow: 'none',
      backgroundImage: 'linear-gradient(to right, rgba(155, 227, 222, 1), rgba(255,0,0,0))'
    },
    underBar: {
      width: '550px',
      boxShadow: 'none',
      textShadow: '4px 4px black',
      backgroundColor: 'rgba(155, 227, 222, 1)',
      height: '76px',
      marginTop: '-76px',
      borderRadius: '0px 10px 10px 0px'
    },
    Table: {
      marginLeft: '35vw',
      marginTop: '-200px'
    }
  }));

export function App() {
  const classes = useStyles(1);
  const [lastRef, setLastRef] = useState(null);

  useEffect(() => {
    const lastChecked = async () => {
      const lastRefreshed = await fetch('http://localhost:9999/lastRefreshed');
      lastRefreshed.json().then(function (data) {
        setLastRef(data);
      })
    };
    lastChecked();
  })

  if (lastRef != null) {
    return (

      <div className={classes.root}>
        <header>
          <AppBar position="static" className={classes.header}> </AppBar>
          <AppBar position="static" className={classes.underBar}>
            <Toolbar>
              <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
            </Toolbar>
          </AppBar>
        </header>
        <div className={classes.all}>
          <Typography variant="body1">This was last refreshed: </Typography>
          <Typography variant="overline" style={{ fontSize: '20px' }}>{lastRef}</Typography>
          <Typography variant="body1">We have loaded the data, if nothing is in the table please refresh!<br />
            Not seeing a site you just entered? Give it a second! - Usually means the site is incorrect.</Typography>
        </div>
        <form action="http://localhost:9999/resetCerts">
          <Button type="submit" variant="outlined" color="secondary" style={{ width: '300px', position: 'relative', marginLeft: '100px' }}>Reset Certicates</Button>
        </form>
        <div className={classes.Table}>
          <RenderTable />
        </div>
      </div>
    )
  } else {
    return (
      <RenderTable />
    )
  }
}
