import React, { useEffect, useState } from "react";
import { Typography, makeStyles, createStyles, Theme, Button } from "@material-ui/core";
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
      height: '50px',
      padding: '5px 5px 5px 5px'
    },
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
        <header></header>
        <div className={classes.all}>
          <Typography variant="h4">SITE CERTIFICATE CHECKER</Typography>
          <Typography variant="body1">This was last refreshed: </Typography>
          <Typography variant="overline" style={{ fontSize: '20px' }}>{lastRef}</Typography>
          <Typography variant="body1">We have loaded the data, if nothing is in the table please refresh!<br />
            Not seeing a site you just entered? Give it a second! - Usually means the site is incorrect.</Typography>
        </div>
        <form action="http://localhost:9999/resetCerts">
          <Button type="submit" variant="outlined" color="secondary" style={{ width: '300px', position: 'relative', marginLeft: '100px' }}>Reset Certicates</Button>
        </form>
        <RenderTable />
      </div>
    )
  } else {
    return (
      <RenderTable />
    )
  }
}
