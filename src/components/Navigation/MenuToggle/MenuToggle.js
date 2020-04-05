import React from 'react';
import classes from './MenuToggle.css'

const menuToggle = (props) => (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default menuToggle;