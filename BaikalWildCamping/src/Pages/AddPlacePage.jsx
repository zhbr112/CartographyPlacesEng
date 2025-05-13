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
            name: 'питьевая вода',
            icon: TbBottle
        },
        {
            id: 1,
            name: 'мобильная связь',
            icon: PiCellTower
        },
        {
            id: 2,
            name: 'костровище',
            icon: TbCampfire
        },
        {
            id: 3,
            name: 'туалет',
            icon: TbToiletPaper
        },
        {
            id: 4,
            name: 'берег',
            icon: FaWater
        },
        {
            id: 5,
            name: 'рыбалка',
            icon: TbFish
        },
        {
            id: 6,
            name: 'веломаршрут',
            icon: TbBike
        },
        {
            id: 7,
            name: 'платно',
            icon: PiHandCoins
        },
        {
            id: 8,
            name: 'песок',
            icon: TbGrain
        },
        {
            id: 9,
            name: 'камни',
            icon: TbHexagons
        },
        {
            id: 10,
            name: 'платформа',
            icon: TbBuildingBridge2
        },
    ];

    const [enabledTags, setEnabledTags] = useState([]);

    const navigate = useNavigate();

    function addPlace() {
        if (isNaN(longitude) || isNaN(latitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            alert("неверные координаты");
            return;
        }

        let params = new URLSearchParams({
            longitude: longitude,
            latitude: latitude
        });

        var uri = 'https://zhbr.1ffy.ru/places/add?' + params;

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
                axios.post(`https://zhbr.1ffy.ru/photos/add?placeId=${id}`, photoFormData, {
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
                    <p>Широта</p>
                    <Input label="Широта" disabled={true} value={longitude} />
                </div>
                <div>
                    <p>Долгота</p>
                    <Input label="Долгота" disabled={true} value={latitude} />
                </div>
                <div>
                    <p>Фотография</p>
                    <Input id='photos' type="file" accept='.jpeg, .jpg, .png, image/jpeg image/png' />
                </div>
                <div>
                    <p>Теги</p>
                    <TagContainer tags={tags} setEnabledTags={setEnabledTags} />
                </div>
                <Button className='mt-5' onClick={addPlace}>
                    Добавить
                </Button>
            </div>
        </div>

    )
}