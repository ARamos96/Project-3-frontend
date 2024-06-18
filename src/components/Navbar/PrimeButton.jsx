import React, { useState } from "react";
import { Button } from 'primereact/button';

export default function PrimeButton(props) {

    const { label, icon } = props;


    return (
        <div >
            <Button label={label} icon={icon} />
        </div>
    )
}
        