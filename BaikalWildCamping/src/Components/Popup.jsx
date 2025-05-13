import { Button } from "@material-tailwind/react";
import Cross from "../assets/cross.svg?react";
import PlaceCard from "./PlaceCard";

import React from 'react'

function Popup({ place: place, close: close }) {
    return (
        <div className='bg-white rounded-3xl p-3 text-end'><Button className='rounded-full px-2 py-2' onClick={close}><Cross fill='white' className='mr-1 size-4 inline' /></Button><PlaceCard addedAt={place.addedAt} longitude={place.longitude} latitude={place.latitude} addedBy={place.author} imageUrl='https://baikal-1.ru/wp-content/uploads/2022/08/22-08-12-bbt1-5.jpeg' isVerified={place.verified} tags={place.tags} /></div>
    )
}

export default Popup