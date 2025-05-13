import { useState, useEffect } from "react";
import axios, * as others from 'axios';
import TagContainer from "../Components/TagContainer";
import { TbBeer, TbBike, TbBottle, TbBuildingBridge2, TbCampfire, TbFish, TbGrain, TbHexagons, TbToiletPaper } from "react-icons/tb";
import { FaPlus, FaWater, FaXmark } from "react-icons/fa6";
import { PiCellTower, PiHandCoins } from "react-icons/pi";
import PlaceCollection from "../Components/PlaceCollection";
import { YMap, YMapComponentsProvider, YMapDefaultFeaturesLayer, YMapDefaultSchemeLayer, YMapListener } from "ymap3-components";
import Pin from "../Components/Pin";
import { useAuth } from "../provider/authProvider";

export default function IndexPage() {
    const { token } = useAuth();

    const [enabledTags, setEnabledTags] = useState([]);

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

    // const places = [
    //     {
    //         id: 0,
    //         highlighted: false,
    //         latitude: 52.025,
    //         longitude: 105.402,
    //         tags: [tags[0], tags[2], tags[3], tags[4], {
    //             id: 5,
    //             name: 'пиво',
    //             icon: TbBeer
    //         }, {
    //             id: 6,
    //             name: 'рыба',
    //             icon: TbFish
    //         }],
    //         verified: true,
    //         addedAt: new Date(),
    //         author: { firstName: 'Максим', photoUrl: 'https://sun9-16.userapi.com/impg/MSpMaTf0cnMkQXLyesgvR1ll8ZSH0qj2JmsmVA/RHTxj2pJ0RY.jpg?size=702x703&quality=95&sign=b4aab8fe2dde1f99820cf155c085255f&type=album' }
    //     },
    //     {
    //         id: 1,
    //         highlighted: false,
    //         latitude: 52.055,
    //         longitude: 105.402,
    //         tags: [tags[0], tags[1], tags[2]],
    //         verified: false,
    //         addedAt: new Date(),
    //         author: { firstName: 'Стас', photoUrl: 'https://sun9-26.userapi.com/impg/Aoyer2bF16LBTkswR3JGzozLMqF2qAKMr6Cyyw/2WW6umUxVsM.jpg?size=524x476&quality=96&sign=c28998ab2eea0d8ca0fd00d3771499ad&type=album' }
    //     },
    //     {
    //         id: 2,
    //         highlighted: false,
    //         latitude: 52.914906,
    //         longitude: 105.762777,
    //         tags: [tags[0], tags[1]],
    //         verified: true,
    //         addedAt: new Date(),
    //         author: { firstName: 'Всеволод', photoUrl: 'https://sun9-74.userapi.com/impg/lCoPyaidxoRLnsa-XBI0aCQNhq_zUkePo3_x0w/y3m2oQzg1fE.jpg?size=1620x2160&quality=95&sign=14e2fce64a39de36a4df5427b7fd3267&type=album' }
    //     }
    // ];

    const [places, setPlaces] = useState([]);

    const [isAddMode, setIsAddMode] = useState(false);

    const clickHandler = (layer, spot, object) => {
        //navigate(`/add/${spot.coordinates[0]}/${spot.coordinates[1]}`);
        window.location.href = `/add/${spot.coordinates[0]}/${spot.coordinates[1]}`;
        //else layer.entity.element.click();
    };

    useEffect(() => {
        var params = new URLSearchParams({
            longitude: 104.86,
            latitude: 51.72,
            radius: 1000,
            count: 1000,
        });

        var uri = 'https://zhbr.1ffy.ru/places/get?' + params;

        for (var i = 0; i < enabledTags.length; i++) {
            uri += `&tags=${enabledTags[i]}`;
        }

        axios.get(uri).then(res => {
            var temp = res.data.places.map(data => {
                return {
                    id: data.place.id,
                    author: data.author,
                    addedAt: new Date(Date.parse(data.place.addedAt)),
                    latitude: data.place.latitude,
                    longitude: data.place.longitude,
                    tags: data.place.tags.map(tag => tags[tag]),
                    verified: data.place.verified
                };
            });
            setPlaces(temp);
        }).catch(err => console.log(err));
    }, [enabledTags])

    return (
        <>
            <div className='fixed top-3 left-3 flex pointer-events-none z-10'>
                <div className='pr-3 w-1/4 min-w-[35rem] pointer-events-auto hidden md:block'>
                    <PlaceCollection places={places} />
                </div>
                <TagContainer className='w-[60vw] flex gap-2 h-min ml-3 pointer-events-auto' tags={tags} setEnabledTags={setEnabledTags} />
            </div>

            <div className={'z-20 fixed bottom-10 right-5 rounded-full p-7 text-lg ' + (token ? '' : 'hidden')} style={{ backgroundColor: isAddMode ? 'green' : 'white' }} onClick={() => setIsAddMode(p => !p)}>
                {!isAddMode ? <FaPlus /> : <FaXmark />}
            </div>

            <div className='bottom-0 right-0 fixed h-screen w-screen'>
                <YMapComponentsProvider apiKey='5f247f55-074a-4c6f-912a-e1920a225f99' lang='ru_RU'>
                    <YMap id='map' theme='dark' mode='vector' location={{ center: [104.86, 51.72], zoom: 10 }}>
                        {places.map(place => (<Pin key={place.id} place={place} />))}
                        <YMapDefaultFeaturesLayer />
                        <YMapDefaultSchemeLayer />
                        {isAddMode && <YMapListener layer='any' onClick={clickHandler} />}
                    </YMap>
                </YMapComponentsProvider>
            </div>
        </>
    )
}
