import { Button, Input } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom"
import TagContainer from "../Components/TagContainer";
import { TbBike, TbBottle, TbBuildingBridge2, TbCampfire, TbFish, TbGrain, TbHexagons, TbToiletPaper } from "react-icons/tb";
import { PiCellTower, PiHandCoins } from "react-icons/pi";
import { useRef, useState } from "react";
import { FaWater } from "react-icons/fa6";
import axios from "axios";

export default function AddPlacePage() {
    const { longitude, latitude } = useParams();

    var tags = [
        {
            id: 0,
            name: 'fresh water',
            icon: TbBottle
        },
        {
            id: 1,
            name: 'mobile connection',
            icon: PiCellTower
        },
        {
            id: 2,
            name: 'fire pit',
            icon: TbCampfire
        },
        {
            id: 3,
            name: 'restroom',
            icon: TbToiletPaper
        },
        {
            id: 4,
            name: 'shore',
            icon: FaWater
        },
        {
            id: 5,
            name: 'fishing',
            icon: TbFish
        },
        {
            id: 6,
            name: 'cycling',
            icon: TbBike
        },
        {
            id: 7,
            name: 'fee',
            icon: PiHandCoins
        },
        {
            id: 8,
            name: 'sand',
            icon: TbGrain
        },
        {
            id: 9,
            name: 'rocks',
            icon: TbHexagons
        },
        {
            id: 10,
            name: 'platform',
            icon: TbBuildingBridge2
        },
    ];

    const [enabledTags, setEnabledTags] = useState([]);

    const navigate = useNavigate();

    function addPlace() {
        if (isNaN(longitude) || isNaN(latitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            alert("Incorrect location");
            return;
        }

        let params = new URLSearchParams({
            longitude: longitude,
            latitude: latitude
        });

        var uri = 'https://baikal.1zq.ru/api/places/add?' + params;

        for (var i = 0; i < enabledTags.length; i++) {
            uri += `&tags=${enabledTags[i]}`;
        }

        let photo = document.getElementById("photos").files[0];
        let photoFormData = new FormData();

        photoFormData.append("file", photo);

        axios.post(uri).then(res => {
            console.log(res.data.object.id);

            var id = res.data.object.id;

            if (photo)
                axios.post(`https://baikal.1zq.ru/api/photos/add?placeId=${id}`, photoFormData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
        }
        ).catch(error => console.error(error));



        navigate('/');
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='w-1/4 flex flex-col gap-4 rounded-3xl p-5 bg-white text-left'>
                <div>
                    <p>Latitude</p>
                    <Input label="Latitude" disabled={true} value={longitude} />
                </div>
                <div>
                    <p>Longitude</p>
                    <Input label="Longitude" disabled={true} value={latitude} />
                </div>
                <div>
                    <p>Photos</p>
                    <Input id='photos' type="file" accept='.jpeg, .jpg, .png, image/jpeg image/png' />
                </div>
                <div>
                    <p>Tags</p>
                    <TagContainer tags={tags} setEnabledTags={setEnabledTags} />
                </div>
                <Button className='mt-5' onClick={addPlace}>
                    Publish
                </Button>
            </div>
        </div>

    )
}