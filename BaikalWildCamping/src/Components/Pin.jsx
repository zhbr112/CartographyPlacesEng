import { YMapDefaultMarker } from "ymap3-components";
import { useMemo, } from "react";

import Popup from "./Popup";

export default function Pin({ place: place }) {
    const popup = useMemo(() => ({
        content: (close) => <Popup close={close} place={place} />,
        position: 'right'
    }), []);

    return (
        <YMapDefaultMarker key={place.id} coordinates={[place.longitude, place.latitude]} draggable={false} popup={popup}>

        </YMapDefaultMarker>
    )
}