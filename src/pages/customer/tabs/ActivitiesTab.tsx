import React from "react";
import { Activity } from "../../../types/customer";
import Timeline from "components/customers/Timeline";

export default function ActivitiesTab({ items }: { items: Activity[] }): JSX.Element {
    return <Timeline items={items} />;
}


