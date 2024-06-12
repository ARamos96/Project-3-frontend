import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function AccordionComponent(props) {

    const { question, answer } = props;
    return (
        <div className="card">
            <Accordion activeIndex={0}>
                <AccordionTab header={question}>
                    <p className="m-0">
                    {answer}
                    </p>
                </AccordionTab>
            </Accordion>
        </div>
    )
}