import React from 'react';

import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems';
import MenuToggle from '../../Navigation/MenuToggle/MenuToggle';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <MenuToggle 
            clicked={props.menuToggleClicked}
             />
        <div className={classes.Logo}>
        <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems/>
        </nav>
    </header>
);

export default toolbar