import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import "./Accordion.css";

export default function AccordionComponent(props) {

    const { question, answer } = props;
    return (
        <div className="accordion">
            <Accordion activeIndex={1}>
                <AccordionTab header={question}>
                    <p className="m-0">
                    {answer}
                    </p>
                </AccordionTab>
            </Accordion>
        </div>
    )
}